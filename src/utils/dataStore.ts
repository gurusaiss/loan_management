// Data store utility for offline functionality with cloud sync
export interface LoanData {
  id: string;
  type: 'lend' | 'borrow';
  amount: number;
  interestRate: number;
  repaymentDate: string;
  createdAt: string;
  updatedAt: string;
  
  // Lender/Borrower info
  lenderName: string;
  lenderPhone: string;
  lenderAddress: string;
  
  // Receiver/Borrower info  
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  
  // Documentation
  idProofType: string;
  idProofFile?: File | string;
  contractGenerated: boolean;
  contractUrl?: string;
  
  // Payment tracking
  totalPaid: number;
  remainingBalance: number;
  payments: PaymentRecord[];
  
  // Sync status
  synced: boolean;
  needsSync: boolean;
}

export interface PaymentRecord {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
  synced: boolean;
}

export interface NotificationData {
  id: string;
  type: 'payment_due' | 'payment_overdue' | 'loan_completed';
  loanId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  synced: boolean;
}

class DataStore {
  private static instance: DataStore;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    // Monitor online/offline status
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private handleOnline() {
    this.isOnline = true;
    this.syncToCloud();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  // Loan management
  async saveLoans(loans: LoanData[]): Promise<void> {
    const existingLoans = await this.getLoans();
    const updatedLoans = [...existingLoans];

    loans.forEach(loan => {
      const existingIndex = updatedLoans.findIndex(l => l.id === loan.id);
      if (existingIndex >= 0) {
        updatedLoans[existingIndex] = { ...loan, needsSync: true, synced: false };
      } else {
        updatedLoans.push({ ...loan, needsSync: true, synced: false });
      }
    });

    localStorage.setItem('loans', JSON.stringify(updatedLoans));
    
    if (this.isOnline) {
      this.syncToCloud();
    }
  }

  async saveLoan(loan: LoanData): Promise<void> {
    await this.saveLoans([loan]);
  }

  async getLoans(): Promise<LoanData[]> {
    const loans = localStorage.getItem('loans');
    return loans ? JSON.parse(loans) : [];
  }

  async getLoanById(id: string): Promise<LoanData | null> {
    const loans = await this.getLoans();
    return loans.find(loan => loan.id === id) || null;
  }

  async deleteLoan(id: string): Promise<void> {
    const loans = await this.getLoans();
    const filteredLoans = loans.filter(loan => loan.id !== id);
    localStorage.setItem('loans', JSON.stringify(filteredLoans));
    
    if (this.isOnline) {
      this.syncToCloud();
    }
  }

  // Payment management
  async savePayment(payment: PaymentRecord): Promise<void> {
    const loans = await this.getLoans();
    const loan = loans.find(l => l.id === payment.loanId);
    
    if (loan) {
      loan.payments = loan.payments || [];
      const existingPaymentIndex = loan.payments.findIndex(p => p.id === payment.id);
      
      if (existingPaymentIndex >= 0) {
        loan.payments[existingPaymentIndex] = { ...payment, synced: false };
      } else {
        loan.payments.push({ ...payment, synced: false });
      }
      
      // Update loan totals
      loan.totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
      loan.remainingBalance = this.calculateRemainingBalance(loan);
      loan.needsSync = true;
      loan.synced = false;
      
      await this.saveLoan(loan);
    }
  }

  private calculateRemainingBalance(loan: LoanData): number {
    const principal = loan.amount;
    const rate = loan.interestRate / 100;
    const timeInYears = (new Date(loan.repaymentDate).getTime() - new Date(loan.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    // Simple interest calculation
    const totalAmount = principal * (1 + rate * timeInYears);
    return Math.max(0, totalAmount - loan.totalPaid);
  }

  // Notification management
  async saveNotification(notification: NotificationData): Promise<void> {
    const notifications = await this.getNotifications();
    const existingIndex = notifications.findIndex(n => n.id === notification.id);
    
    if (existingIndex >= 0) {
      notifications[existingIndex] = { ...notification, synced: false };
    } else {
      notifications.push({ ...notification, synced: false });
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    if (this.isOnline) {
      this.syncToCloud();
    }
  }

  async getNotifications(): Promise<NotificationData[]> {
    const notifications = localStorage.getItem('notifications');
    return notifications ? JSON.parse(notifications) : [];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notifications = await this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.read = true;
      notification.synced = false;
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      if (this.isOnline) {
        this.syncToCloud();
      }
    }
  }

  // Generate notifications for upcoming due dates
  async generatePaymentNotifications(): Promise<void> {
    const loans = await this.getLoans();
    const notifications: NotificationData[] = [];
    const today = new Date();
    
    loans.forEach(loan => {
      if (loan.remainingBalance > 0) {
        const dueDate = new Date(loan.repaymentDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 7 && daysUntilDue > 0) {
          notifications.push({
            id: `payment_reminder_${loan.id}_${Date.now()}`,
            type: 'payment_due',
            loanId: loan.id,
            title: loan.type === 'lend' ? 'Payment Due from Borrower' : 'Payment Due',
            message: `₹${loan.remainingBalance.toLocaleString()} payment due in ${daysUntilDue} days`,
            date: new Date().toISOString(),
            read: false,
            synced: false
          });
        } else if (daysUntilDue < 0) {
          notifications.push({
            id: `payment_overdue_${loan.id}_${Date.now()}`,
            type: 'payment_overdue',
            loanId: loan.id,
            title: loan.type === 'lend' ? 'Payment Overdue' : 'Payment Overdue',
            message: `₹${loan.remainingBalance.toLocaleString()} payment is ${Math.abs(daysUntilDue)} days overdue`,
            date: new Date().toISOString(),
            read: false,
            synced: false
          });
        }
      }
    });
    
    // Save new notifications
    for (const notification of notifications) {
      await this.saveNotification(notification);
    }
  }

  // Cloud sync functionality
  private async syncToCloud(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;

    try {
      // Get all unsynced data
      const loans = await this.getLoans();
      const notifications = await this.getNotifications();
      
      const unsyncedLoans = loans.filter(loan => !loan.synced);
      const unsyncedNotifications = notifications.filter(notif => !notif.synced);

      // Simulate cloud sync (replace with actual API calls)
      if (unsyncedLoans.length > 0 || unsyncedNotifications.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        
        // Mark as synced
        unsyncedLoans.forEach(loan => {
          loan.synced = true;
          loan.needsSync = false;
        });
        
        unsyncedNotifications.forEach(notif => {
          notif.synced = true;
        });
        
        // Save updated data
        localStorage.setItem('loans', JSON.stringify(loans));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Dispatch sync event
        window.dispatchEvent(new CustomEvent('dataSynced', { 
          detail: { 
            loans: unsyncedLoans.length, 
            notifications: unsyncedNotifications.length 
          }
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
      window.dispatchEvent(new CustomEvent('syncFailed', { detail: error }));
    } finally {
      this.syncInProgress = false;
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{ needsSync: boolean; isOnline: boolean; lastSync?: string }> {
    const loans = await this.getLoans();
    const notifications = await this.getNotifications();
    
    const needsSync = loans.some(loan => loan.needsSync) || 
                     notifications.some(notif => !notif.synced);
    
    const lastSync = localStorage.getItem('lastSyncTime');
    
    return {
      needsSync,
      isOnline: this.isOnline,
      lastSync: lastSync || undefined
    };
  }

  // Utility methods
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async exportData(): Promise<string> {
    const loans = await this.getLoans();
    const notifications = await this.getNotifications();
    
    return JSON.stringify({
      loans,
      notifications,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.loans) {
        localStorage.setItem('loans', JSON.stringify(data.loans));
      }
      
      if (data.notifications) {
        localStorage.setItem('notifications', JSON.stringify(data.notifications));
      }
      
      if (this.isOnline) {
        this.syncToCloud();
      }
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }
}

export const dataStore = DataStore.getInstance();