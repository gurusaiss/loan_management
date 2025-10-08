// PDF generation utility for loan contracts
import { LoanData } from './dataStore';

interface ContractData {
  loanData: LoanData;
  contractDate: string;
  language: 'en' | 'te';
}

export class PDFGenerator {
  static async generateLoanContract(contractData: ContractData): Promise<Blob> {
    const { loanData, contractDate, language } = contractData;
    
    // Create PDF content using HTML Canvas approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    // Set canvas size (A4 dimensions at 96 DPI)
    canvas.width = 794;
    canvas.height = 1123;
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set up fonts and colors
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    
    let yPosition = 60;
    const margin = 60;
    const lineHeight = 30;
    
    // Title
    const title = language === 'te' ? 'లోన్ కాంట్రాక్ట్' : 'LOAN CONTRACT';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, yPosition);
    yPosition += lineHeight * 2;
    
    // Contract details
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    const details = [
      {
        label: language === 'te' ? 'కాంట్రాక్ట్ తేదీ:' : 'Contract Date:',
        value: new Date(contractDate).toLocaleDateString()
      },
      {
        label: language === 'te' ? 'లోన్ ID:' : 'Loan ID:',
        value: loanData.id
      },
      {
        label: language === 'te' ? 'లోన్ రకం:' : 'Loan Type:',
        value: loanData.type === 'lend' ? 
          (language === 'te' ? 'రుణం ఇవ్వడం' : 'Lending') : 
          (language === 'te' ? 'రుణం తీసుకోవడం' : 'Borrowing')
      }
    ];
    
    details.forEach(detail => {
      ctx.font = 'bold 16px Arial';
      ctx.fillText(detail.label, margin, yPosition);
      ctx.font = '16px Arial';
      ctx.fillText(detail.value, margin + 150, yPosition);
      yPosition += lineHeight;
    });
    
    yPosition += lineHeight;
    
    // Parties section
    ctx.font = 'bold 18px Arial';
    ctx.fillText(language === 'te' ? 'పార్టీలు:' : 'PARTIES:', margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Lender details
    ctx.font = 'bold 16px Arial';
    ctx.fillText(language === 'te' ? 'రుణదాత వివరాలు:' : 'LENDER DETAILS:', margin, yPosition);
    yPosition += lineHeight;
    
    const lenderDetails = [
      {
        label: language === 'te' ? 'పేరు:' : 'Name:',
        value: loanData.lenderName
      },
      {
        label: language === 'te' ? 'ఫోన్:' : 'Phone:',
        value: loanData.lenderPhone
      },
      {
        label: language === 'te' ? 'చిరునామా:' : 'Address:',
        value: loanData.lenderAddress
      }
    ];
    
    lenderDetails.forEach(detail => {
      ctx.font = '14px Arial';
      ctx.fillText(`${detail.label} ${detail.value}`, margin + 20, yPosition);
      yPosition += lineHeight * 0.8;
    });
    
    yPosition += lineHeight * 0.5;
    
    // Receiver/Borrower details
    ctx.font = 'bold 16px Arial';
    const receiverTitle = loanData.type === 'lend' ? 
      (language === 'te' ? 'స్వీకర్త వివరాలు:' : 'RECEIVER DETAILS:') :
      (language === 'te' ? 'అరువుదారు వివరాలు:' : 'BORROWER DETAILS:');
    ctx.fillText(receiverTitle, margin, yPosition);
    yPosition += lineHeight;
    
    const receiverDetails = [
      {
        label: language === 'te' ? 'పేరు:' : 'Name:',
        value: loanData.receiverName
      },
      {
        label: language === 'te' ? 'ఫోన్:' : 'Phone:',
        value: loanData.receiverPhone
      },
      {
        label: language === 'te' ? 'చిరునామా:' : 'Address:',
        value: loanData.receiverAddress
      },
      {
        label: language === 'te' ? 'గుర్తింపు రుజువు:' : 'ID Proof:',
        value: loanData.idProofType
      }
    ];
    
    receiverDetails.forEach(detail => {
      ctx.font = '14px Arial';
      ctx.fillText(`${detail.label} ${detail.value}`, margin + 20, yPosition);
      yPosition += lineHeight * 0.8;
    });
    
    yPosition += lineHeight;
    
    // Loan terms
    ctx.font = 'bold 18px Arial';
    ctx.fillText(language === 'te' ? 'లోన్ నిబంధనలు:' : 'LOAN TERMS:', margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    const loanTerms = [
      {
        label: language === 'te' ? 'మొత్తం:' : 'Principal Amount:',
        value: `₹${loanData.amount.toLocaleString()}`
      },
      {
        label: language === 'te' ? 'వడ్డీ రేటు:' : 'Interest Rate:',
        value: `${loanData.interestRate}% ${language === 'te' ? 'వార్షిక' : 'per annum'}`
      },
      {
        label: language === 'te' ? 'తిరిగి చెల్లింపు తేదీ:' : 'Repayment Date:',
        value: new Date(loanData.repaymentDate).toLocaleDateString()
      }
    ];
    
    loanTerms.forEach(term => {
      ctx.font = '14px Arial';
      ctx.fillText(`${term.label} ${term.value}`, margin + 20, yPosition);
      yPosition += lineHeight * 0.8;
    });
    
    yPosition += lineHeight * 2;
    
    // Terms and conditions
    ctx.font = 'bold 16px Arial';
    ctx.fillText(language === 'te' ? 'నियమాలు మరియు షరతులు:' : 'TERMS AND CONDITIONS:', margin, yPosition);
    yPosition += lineHeight;
    
    const termsText = language === 'te' ? [
      '1. రుణగ్రహీత నిర్ణీత తేదీలో పూర్తి మొత్తాన్ని చెల్లించాలి.',
      '2. ఆలస్యం అయిన చెల్లింపులకు అదనపు వడ్డీ వర్తిస్తుంది.',
      '3. రెండు పార్టీలు ఈ ఒప్పందంలోని నియమాలను అంగీకరించారు.',
      '4. ఏదైనా వివాదాలు చట్టబద్ధంగా పరిష్కరించబడతాయి.'
    ] : [
      '1. The borrower agrees to repay the full amount on the specified date.',
      '2. Late payments will incur additional interest charges.',
      '3. Both parties agree to the terms outlined in this contract.',
      '4. Any disputes will be resolved through legal means.'
    ];
    
    ctx.font = '12px Arial';
    termsText.forEach(term => {
      ctx.fillText(term, margin + 20, yPosition);
      yPosition += lineHeight * 0.7;
    });
    
    yPosition += lineHeight * 2;
    
    // Signatures
    ctx.font = 'bold 14px Arial';
    const signatureText = language === 'te' ? 'సంతకాలు:' : 'SIGNATURES:';
    ctx.fillText(signatureText, margin, yPosition);
    yPosition += lineHeight * 2;
    
    // Lender signature
    ctx.font = '12px Arial';
    ctx.fillText(language === 'te' ? 'రుణదాత సంతకం:' : 'Lender Signature:', margin, yPosition);
    ctx.fillText('_____________________', margin + 150, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Receiver signature
    const receiverSigLabel = loanData.type === 'lend' ? 
      (language === 'te' ? 'స్వీకర్త సంతకం:' : 'Receiver Signature:') :
      (language === 'te' ? 'అరువుదారు సంతకం:' : 'Borrower Signature:');
    ctx.fillText(receiverSigLabel, margin, yPosition);
    ctx.fillText('_____________________', margin + 150, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Date and timestamp
    ctx.fillText(language === 'te' ? 'తేదీ:' : 'Date:', margin, yPosition);
    ctx.fillText('_____________________', margin + 150, yPosition);
    
    // Add timestamp footer
    yPosition = canvas.height - 40;
    ctx.font = '10px Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'center';
    const timestamp = language === 'te' ? 
      `జనరేట్ చేయబడింది: ${new Date().toLocaleString()}` :
      `Generated on: ${new Date().toLocaleString()}`;
    ctx.fillText(timestamp, canvas.width / 2, yPosition);
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to generate PDF');
        }
      }, 'image/png');
    });
  }

  static async downloadContract(contractData: ContractData): Promise<void> {
    try {
      const blob = await this.generateLoanContract(contractData);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `loan_contract_${contractData.loanData.id}_${Date.now()}.png`;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  }

  // Generate payment receipt
  static async generatePaymentReceipt(loanData: LoanData, paymentAmount: number, language: 'en' | 'te'): Promise<void> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    const title = language === 'te' ? 'చెల్లింపు రసీదు' : 'PAYMENT RECEIPT';
    ctx.fillText(title, canvas.width / 2, 50);
    
    // Receipt details
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    let y = 100;
    
    const details = [
      {
        label: language === 'te' ? 'లోన్ ID:' : 'Loan ID:',
        value: loanData.id
      },
      {
        label: language === 'te' ? 'చెల్లించిన మొత్తం:' : 'Amount Paid:',
        value: `₹${paymentAmount.toLocaleString()}`
      },
      {
        label: language === 'te' ? 'తేదీ:' : 'Date:',
        value: new Date().toLocaleDateString()
      },
      {
        label: language === 'te' ? 'మిగిలిన బ్యాలెన్స్:' : 'Remaining Balance:',
        value: `₹${loanData.remainingBalance.toLocaleString()}`
      }
    ];
    
    details.forEach(detail => {
      ctx.fillText(`${detail.label} ${detail.value}`, 50, y);
      y += 30;
    });
    
    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payment_receipt_${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }
}