import React, { useState, useRef } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Play, Pause, Volume2, Languages, Smartphone, BarChart3, Camera, CreditCard, Shield, CheckCircle, User, MapPin, Calendar, Phone, AlertCircle, Wifi } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoStates, setVideoStates] = useState([
    { playing: false, completed: false, muted: false, progress: 0, autoPlayed: false, error: false, userInteracted: false },
    { playing: false, completed: false, muted: false, progress: 0, autoPlayed: false, error: false, userInteracted: false }
  ]);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [scannedData, setScannedData] = useState<any>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  // Video URLs - Replace these with your own video URLs
  const videoUrls = [
    'https://naliudaykumar.github.io/king-aloha-video/InShot_20251007_182259875%20(2).mp4', // App introduction video
    'https://naliudaykumar.github.io/new/InShkkkkkkkkkkot_20251008_181743843.mp4'  // Features overview video
  ];

  // Translation dictionary for Aadhaar page
  const aadhaarTranslations = {
    en: {
      kycCompleted: 'E-KYC Completed!',
      identityVerified: 'Your identity has been successfully verified',
      fullName: 'Full Name',
      dateOfBirth: 'Date of Birth',
      address: 'Address',
      mobileNumber: 'Mobile Number',
      bankAccount: 'Bank Account',
      continueToApp: 'Continue to App',
      // Data translations
      nameValue: 'Ram Kumar Sharma',
      addressValue: '123, Gandhi Street, Hyderabad, Telangana - 500001'
    },
    te: {
      kycCompleted: 'E-KYC పూర్తయింది!',
      identityVerified: 'మీ గుర్తింపు విజయవంతంగా ధృవీకరించబడింది',
      fullName: 'పూర్తి పేరు',
      dateOfBirth: 'జన్మ తేదీ',
      address: 'చిరునామా',
      mobileNumber: 'మొబైల్ నంబర్',
      bankAccount: 'బ్యాంక్ ఖాతా',
      continueToApp: 'యాప్‌లోకి వెళ్లండి',
      // Data translations
      nameValue: 'రామ్ కుమార్ శర్మ',
      addressValue: '123, గాంధీ వీధి, హైదరాబాద్, తెలంగాణ - 500001'
    }
  };

  // Global translate handled by LanguageProvider via toggleLanguage

  const onboardingSteps = [
    {
      title: '',
      subtitle: '',
      content: 'app_intro'
    },
    {
      title: '',
      subtitle: '',
      content: 'features_video'
    },
    {
      title: '',
      subtitle: '',
      content: 'aadhaar_scan'
    },
    {
      title: '',
      subtitle: '',
      content: 'otp_verification'
    },
    {
      title: '',
      subtitle: '',
      content: 'kyc_completed'
    }
  ];

  const playVideo = (stepIndex: number) => {
    const video = videoRefs.current[stepIndex];
    if (video) {
      // Ensure correct video source
      if (video.src !== videoUrls[stepIndex]) {
        video.src = videoUrls[stepIndex];
        video.load();
      }

      console.log(`Playing video ${stepIndex}: ${videoUrls[stepIndex]}`);

      // User interaction - enable audio automatically when user clicks play
      video.volume = 0.8;
      video.muted = false;

      video.play().then(() => {
        console.log(`Video ${stepIndex} playing successfully - Volume: ${video.volume}, Muted: ${video.muted}`);
        setVideoStates(prev => prev.map((state, index) =>
          index === stepIndex
            ? { ...state, playing: true, error: false, muted: false, userInteracted: true }
            : state
        ));

        // Show confirmation that audio is enabled
        toast.success(
          currentLanguage === 'te'
            ? '🔊 వీడియో ఆడియో ఆన్‌తో ప్లే అవుతోంది'
            : '🔊 Video playing with audio',
          { duration: 2000 }
        );
      }).catch(error => {
        console.error('Video play failed:', error);
        setVideoStates(prev => prev.map((state, index) =>
          index === stepIndex
            ? { ...state, error: true, playing: false }
            : state
        ));
      });
    }
  };

  const pauseVideo = (stepIndex: number) => {
    const video = videoRefs.current[stepIndex];
    if (video) {
      console.log(`Pausing video ${stepIndex}`);
      video.pause();
      setVideoStates(prev => prev.map((state, index) =>
        index === stepIndex
          ? { ...state, playing: false }
          : state
      ));
    }
  };

  const handleVideoProgress = (stepIndex: number, currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    setVideoStates(prev => prev.map((state, index) =>
      index === stepIndex
        ? { ...state, progress }
        : state
    ));
  };

  const handleVideoEnded = (stepIndex: number) => {
    setVideoStates(prev => prev.map((state, index) =>
      index === stepIndex
        ? { ...state, playing: false, completed: true, progress: 100 }
        : state
    ));
  };

  // Toggle play/pause helper
  const togglePlayPause = (stepIndex: number) => {
    const video = videoRefs.current[stepIndex];
    if (!video) return;
    if (video.paused) {
      // Ensure audio is ON when starting playback via user interaction
      video.muted = false;
      video.volume = 0.8;
      video.play();
      setVideoStates(prev => prev.map((s, i) => i === stepIndex ? { ...s, playing: true, muted: false, userInteracted: true } : s));
    } else {
      video.pause();
      setVideoStates(prev => prev.map((s, i) => i === stepIndex ? { ...s, playing: false } : s));
    }
  };

  const handleVideoError = (stepIndex: number, error: any) => {
    console.error(`Video ${stepIndex} loading error:`, error);
    setVideoStates(prev => prev.map((state, index) =>
      index === stepIndex
        ? { ...state, error: true, playing: false }
        : state
    ));
    toast.error(currentLanguage === 'te' ? 'వీడియో లోడ్ చేయడంలో లోపం' : 'Video loading error');
  };

  // Enhanced camera scan with ML extraction
  const handleCameraScan = async () => {
    try {
      // Check if camera is available
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera if available
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        // Create a temporary video element for camera preview
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Stop camera after 3 seconds and extract data
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());

          // Simulate ML extraction with realistic data in English by default
          const extractedData = {
            aadhaarNumber: '1234 5678 9012',
            fullName: 'Ram Kumar Sharma', // Always in English first
            dateOfBirth: '01/01/1990',
            gender: 'Male',
            address: '123, Gandhi Street, Hyderabad, Telangana - 500001',
            mobileNumber: '9876543210'
          };

          toast.success(
            currentLanguage === 'te'
              ? 'ఆధార్ కార్డ్ విజయవంతంగా స్కాన్ చేయబడింది'
              : 'Aadhaar card scanned successfully'
          );

          proceedWithExtractedData(extractedData);
        }, 3000);

        toast.info(
          currentLanguage === 'te'
            ? 'కెమెరా ప్రారంభించబడింది. ఆధార్ కార్డ్‌ను కెమెరా ముందు ఉంచండి'
            : 'Camera started. Hold Aadhaar card in front of camera'
        );
      } else {
        // Fallback if camera is not available
        throw new Error('Camera not available');
      }
    } catch (error) {
      console.error('Camera scan error:', error);
      toast.error(
        currentLanguage === 'te'
          ? 'కెమెరా యాక్సెస్ చేయడంలో లోపం. మాన్యువల్ ఎంట్రీ ఉపయోగించండి'
          : 'Camera access error. Please use manual entry'
      );

      // Fallback to dummy data
      proceedWithDummyData();
    }
  };

  const handleManualEntry = () => {
    if (aadhaarNumber.length === 12) {
      // Proceed with entered Aadhaar number
      proceedWithDummyData();
    }
  };

  const handleAadhaarContinue = () => {
    if (aadhaarNumber.length === 12) {
      proceedWithDummyData();
    }
  };

  const proceedWithDummyData = () => {
    // Set dummy Aadhaar data always in English by default
    const mockAadhaarData = {
      aadhaarNumber: aadhaarNumber || '1234 5678 9012',
      fullName: 'Ram Kumar Sharma', // Always English by default
      dateOfBirth: '01/01/1990',
      gender: 'Male',
      address: '123, Gandhi Street, Hyderabad, Telangana - 500001',
      mobileNumber: '9876543210'
    };

    proceedWithExtractedData(mockAadhaarData);
  };

  const proceedWithExtractedData = (extractedData: any) => {
    setScannedData(extractedData);

    // Save profile data to localStorage
    localStorage.setItem('user-profile', JSON.stringify(extractedData));
    localStorage.setItem('user-phone', extractedData.mobileNumber);
    localStorage.setItem('user-auth-method', 'phone');

    // Auto-proceed to OTP step after 1 second
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      toast.success(currentLanguage === 'te' ? 'ఆధార్ వెరిఫై చేయబడింది' : 'Aadhaar verified successfully');
    }, 1000);
  };

  const verifyOTP = async () => {
    setIsVerifying(true);

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsVerifying(false);
    setCurrentStep(currentStep + 1);

    toast.success(currentLanguage === 'te' ? 'E-KYC పూర్తయింది' : 'E-KYC completed successfully');
  };

  // Auto-play video when step changes (with error handling)
  React.useEffect(() => {
    const currentStepIndex = currentStep;
    if (currentStepIndex < 2 && !videoStates[currentStepIndex].autoPlayed && isOnline) {
      const timer = setTimeout(() => {
        const video = videoRefs.current[currentStepIndex];
        if (video) {
          // Force load the correct video source
          video.src = videoUrls[currentStepIndex];
          video.load(); // Reload the video element

          // Set volume for when user unmutes
          video.volume = 0.8;

          // Try unmuted autoplay first (will likely fail due to browser policies)
          video.muted = false;
          video.play().then(() => {
            // Success! Audio autoplay worked
            setVideoStates(prev => prev.map((state, index) =>
              index === currentStepIndex
                ? { ...state, playing: true, autoPlayed: true, muted: false, error: false, userInteracted: true }
                : state
            ));
            console.log(`Auto-play started for video ${currentStepIndex} with audio enabled`);

          }).catch(error => {
            console.log('Unmuted auto-play blocked by browser (expected behavior) - falling back to muted autoplay');
            // Fallback to muted autoplay (browsers allow this)
            video.muted = true;
            video.play().then(() => {
              setVideoStates(prev => prev.map((state, index) =>
                index === currentStepIndex
                  ? { ...state, playing: true, autoPlayed: true, muted: true, error: false }
                  : state
              ));
              console.log(`Auto-play started for video ${currentStepIndex} - muted (tap to unmute)`);

            }).catch(() => {
              setVideoStates(prev => prev.map((state, index) =>
                index === currentStepIndex
                  ? { ...state, error: true, autoPlayed: true }
                  : state
              ));
            });
          });
        }
      }, 1000); // Increased delay for better loading

      return () => clearTimeout(timer);
    }

    // Auto-fill OTP and verify when OTP step loads - increased timing
    if (currentStep === 3 && scannedData) {
      setTimeout(() => {
        setOtp('123456');
        toast.success(currentLanguage === 'te' ? 'OTP ఆటో-ఫిల్ చేయబడింది' : 'OTP auto-filled');

        // Auto-verify after 7 seconds for better user experience
        setTimeout(() => {
          verifyOTP();
        }, 7000);
      }, 3000);
    }
  }, [currentStep, scannedData, isOnline]);

  // Network status monitoring
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset video states when stepping between videos
  React.useEffect(() => {
    // Reset non-current video states
    setVideoStates(prev => prev.map((state, index) =>
      index === currentStep
        ? state // Keep current step state
        : { ...state, playing: false, autoPlayed: false, error: false, progress: 0, userInteracted: false } // Reset others
    ));
  }, [currentStep]);

  // Spacebar toggles play/pause during video steps
  React.useEffect(() => {
    if (currentStep > 1) return; // only for video steps 0 and 1
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const video = videoRefs.current[currentStep];
        if (video) {
          video.muted = false;
          video.volume = 0.8;
        }
        togglePlayPause(currentStep);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentStep]);

  // On first user interaction (tap/click) during video steps, unmute and play with audio
  React.useEffect(() => {
    if (currentStep > 1) return; // only video steps
    const onFirstInteract = () => {
      const video = videoRefs.current[currentStep];
      if (video) {
        video.muted = false;
        video.volume = 0.8;
        if (video.paused) {
          video.play().catch(() => {/* ignore */ });
        }
        setVideoStates(prev => prev.map((s, i) => i === currentStep ? { ...s, muted: false, userInteracted: true, playing: !video.paused } : s));
      }
      // Run only once per step
      window.removeEventListener('pointerdown', onFirstInteract);
    };
    window.addEventListener('pointerdown', onFirstInteract, { once: true });
    return () => window.removeEventListener('pointerdown', onFirstInteract);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipCurrentStep = () => {
    // Pause current video if any
    const video = videoRefs.current[currentStep];
    if (video) video.pause();
    setVideoStates(prev => prev.map((state, index) =>
      index === currentStep
        ? { ...state, completed: true, progress: 100, userInteracted: true, playing: false }
        : state
    ));
    // Move to next step
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const renderVideoPlayer = (stepIndex: number, title: string) => (
    <div className="relative w-full h-full bg-black" onClick={() => togglePlayPause(stepIndex)}>
      {!isOnline && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center text-white">
            <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {currentLanguage === 'te' ? 'ఇంటర్నెట్ కనెక్షన్ అవసరం' : 'Internet connection required'}
            </p>
            <Button onClick={(e) => { e.stopPropagation(); skipCurrentStep(); }} variant="outline" className="text-black">
              {currentLanguage === 'te' ? 'వీడియో దాటవేయండి' : 'Skip Video'}
            </Button>
          </div>
        </div>
      )}

      <video
        ref={(el) => {
          videoRefs.current[stepIndex] = el;
          // Ensure video has correct source when ref is set
          if (el && el.src !== videoUrls[stepIndex]) {
            el.src = videoUrls[stepIndex];
          }
        }}
        className="w-full h-full object-cover"
        autoPlay
        poster={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='100%25' height='100%25' fill='%23000000'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%23ffffff' text-anchor='middle' dy='.3em'%3E${title}%3C/text%3E%3C/svg%3E`}
        onPlay={() => {
          setVideoStates(prev => prev.map((state, index) =>
            index === stepIndex ? { ...state, playing: true } : state
          ));
        }}
        onPause={() => {
          setVideoStates(prev => prev.map((state, index) =>
            index === stepIndex ? { ...state, playing: false } : state
          ));
        }}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement;
          if (video.duration) {
            handleVideoProgress(stepIndex, video.currentTime, video.duration);
          }
        }}
        onEnded={() => handleVideoEnded(stepIndex)}
        onLoadedData={() => {
          console.log(`Video ${stepIndex} loaded successfully: ${videoUrls[stepIndex]}`);
        }}
        onError={(e) => handleVideoError(stepIndex, e)}
        onLoadStart={() => console.log(`Video ${stepIndex} loading started: ${videoUrls[stepIndex]}`)}
        onCanPlay={() => console.log(`Video ${stepIndex} can play: ${videoUrls[stepIndex]}`)}
        onVolumeChange={(e) => {
          const video = e.target as HTMLVideoElement;
          setVideoStates(prev => prev.map((state, index) =>
            index === stepIndex ? { ...state, muted: video.muted } : state
          ));
          console.log(`Video ${stepIndex} volume changed - Muted: ${video.muted}, Volume: ${video.volume}`);
        }}
        onLoadedMetadata={(e) => {
          const video = e.target as HTMLVideoElement;
          // Set initial volume when metadata loads
          video.volume = 0.8;
          console.log(`Video ${stepIndex} metadata loaded - Volume set to: ${video.volume}`);
        }}
        playsInline
        muted={videoStates[stepIndex].muted}
        preload="auto"
        key={`video-${stepIndex}-${videoUrls[stepIndex]}`} // Force re-render when URL changes
      >
        <source src={videoUrls[stepIndex]} type="video/mp4" />
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            {videoStates[stepIndex].error ? (
              <div>
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <p className="text-lg mb-4">
                  {currentLanguage === 'te'
                    ? 'వీడియో లోడ్ చేయడంలో లోపం'
                    : 'Error loading video'
                  }
                </p>
                <Button onClick={(e) => { e.stopPropagation(); skipCurrentStep(); }} variant="outline" className="text-black">
                  {currentLanguage === 'te' ? 'కొనసాగించు' : 'Continue'}
                </Button>
              </div>
            ) : (
              <p className="text-lg">
                {currentLanguage === 'te'
                  ? 'మీ బ్రౌజర్ వీడియో ప్లేబ్యాక్‌ను సపోర్ట్ చేయదు.'
                  : 'Your browser does not support video playback.'
                }
              </p>
            )}
          </div>
        </div>
      </video>

      {/* Skip control for video pages */}
      <div className="absolute top-4 right-4 z-20">
        <Button onClick={(e) => { e.stopPropagation(); skipCurrentStep(); }} variant="secondary" className="bg-white/90 hover:bg-white rounded-full px-4 py-2 text-sm font-semibold">
          {currentLanguage === 'te' ? 'Skip>' : 'Skip>'}
        </Button>
      </div>


      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${videoStates[stepIndex].progress}%` }}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];

    switch (step.content) {
      case 'app_intro':
        return (
          <div className="absolute inset-0">
            {renderVideoPlayer(0, '')}

            {/* Subtitles */}
            {showSubtitles && videoStates[0].playing && (
              <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <p className="text-sm text-center">
                  {currentLanguage === 'te'
                    ? 'మీ స్మార్ట్ లోన్ మేనేజర్‌కు స్వాగతం. మీ ఆర్థిక భవిష్యత్తును మేము సురక్షితంగా నిర్వహిస్తాము.'
                    : 'Welcome to your Smart Loan Manager. We help you manage your financial future securely.'
                  }
                </p>
              </div>
            )}
          </div>
        );

      case 'features_video':
        return (
          <div className="absolute inset-0">
            {renderVideoPlayer(1, '')}

            {/* Subtitles */}
            {showSubtitles && videoStates[1].playing && (
              <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <p className="text-sm text-center">
                  {currentLanguage === 'te'
                    ? 'మా యాప్ ఫీచర్లను అన్వేషించండి: లోన్ ట్రాకింగ్, కంపారిజన్, వాయిస్ సపోర్ట్ మరియు మరెన్నో.'
                    : 'Explore our app features: loan tracking, comparison tools, voice support and much more.'
                  }
                </p>
              </div>
            )}
          </div>
        );

      case 'aadhaar_scan':
        return (
          <div className="absolute inset-0">
            {/* Translation Toggle Button - Top Right */}
            <div className="absolute top-6 right-6 z-30">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white h-10 w-12 p-0 flex flex-col items-center justify-center shadow-lg"
              >
                <div className="flex items-center space-x-0.5">
                  <span className={`text-xs font-bold ${currentLanguage === 'te' ? 'text-blue-600' : 'text-gray-400'}`}>అ</span>
                  <span className={`text-xs font-bold ${currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>A</span>
                </div>
              </Button>
            </div>

            <div className="h-full bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>



                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {currentLanguage === 'te' ? 'ఆధార్ వెరిఫికేషన్' : 'Aadhaar Verification'}
                </h2>

                <p className="text-gray-600 mb-8">
                  {currentLanguage === 'te'
                    ? 'మీ గుర్తింపు ధృవీకరించడానికి ఆధార్ కార్డ్‌ను స్కాన్ చేయండి లేదా మాన్యువల్‌గా ఎంటర్ చేయండి'
                    : 'Scan your Aadhaar card or enter details manually to verify your identity'
                  }
                </p>

                <div className="space-y-4">
                  <Button
                    onClick={handleCameraScan}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl"
                  >
                    <Camera className="h-5 w-5 mr-3" />
                    {currentLanguage === 'te' ? 'కెమెరా స్కాన్' : 'Camera Scan'}
                  </Button>

                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder={currentLanguage === 'te' ? 'ఆధార్ నంబర్ నమోదు చేయండి' : 'Enter Aadhaar Number'}
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaarNumber(value);
                      }}
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-center font-mono tracking-widest"
                      maxLength={12}
                    />
                    <Button
                      onClick={handleAadhaarContinue}
                      disabled={aadhaarNumber.length !== 12}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl"
                    >
                      {currentLanguage === 'te' ? 'కొనసాగించు' : 'Continue'}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  {currentLanguage === 'te'
                    ? 'మీ డేటా సురక్షితంగా మరియు ఎంక్రిప్ట్ చేయబడింది'
                    : 'Your data is secure and encrypted'
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'otp_verification':
        return (
          <div className="absolute inset-0">
            {/* Translation Toggle Button - Top Right */}
            <div className="absolute top-6 right-6 z-30">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white h-10 w-12 p-0 flex flex-col items-center justify-center shadow-lg"
              >
                <div className="flex items-center space-x-0.5">
                  <span className={`text-xs font-bold ${currentLanguage === 'te' ? 'text-blue-600' : 'text-gray-400'}`}>అ</span>
                  <span className={`text-xs font-bold ${currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>A</span>
                </div>
              </Button>
            </div>
            <div className="h-full bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {currentLanguage === 'te' ? 'OTP వెరిఫికేషన్' : 'OTP Verification'}
                </h2>

                <p className="text-gray-600 mb-2">
                  {currentLanguage === 'te'
                    ? 'మేము 6-అంకెల కోడ్‌ను పంపాము'
                    : 'We sent a 6-digit code to'
                  }
                </p>
                <p className="font-semibold text-gray-900 mb-8">
                  {scannedData?.mobileNumber || '+91 98765 43210'}
                </p>

                {/* OTP Input - Centered */}
                <div className="flex justify-center mb-6">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={verifyOTP}
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl"
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {currentLanguage === 'te' ? 'వెరిఫై చేస్తోంది...' : 'Verifying...'}
                    </div>
                  ) : (
                    currentLanguage === 'te' ? 'వెరిఫై చేయండి' : 'Verify OTP'
                  )}
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                  {currentLanguage === 'te'
                    ? 'OTP రాలేదా? 30 సెకన్లలో మళ్ళీ పంపండి'
                    : "Didn't receive OTP? Resend in 30 seconds"
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'kyc_completed':
        const at = aadhaarTranslations[currentLanguage === 'te' ? 'te' : 'en'];
        return (
          <div className="absolute inset-0">
            {/* Translation Toggle Button - Top Right */}
            <div className="absolute top-6 right-6 z-30">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white h-10 w-12 p-0 flex flex-col items-center justify-center shadow-lg"
              >
                <div className="flex items-center space-x-0.5">
                  <span className={`text-xs font-bold ${currentLanguage === 'te' ? 'text-blue-600' : 'text-gray-400'}`}>అ</span>
                  <span className={`text-xs font-bold ${currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>A</span>
                </div>
              </Button>
            </div>

            <div className="h-full bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {at.kycCompleted}
                </h2>

                <p className="text-gray-600 mb-6">
                  {at.identityVerified}
                </p>

                <Card className="mb-6">
                  <CardContent className="p-6 space-y-6">
                    {/* Full Name */}
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        {at.fullName}
                      </h4>
                      <p className="text-gray-800 font-medium text-left pl-7">
                        {at.nameValue}
                      </p>
                    </div>

                    {/* Date of Birth */}
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Calendar className="h-5 w-5 text-green-600 mr-2" />
                        {at.dateOfBirth}
                      </h4>
                      <p className="text-gray-800 font-medium text-left pl-7">{scannedData?.dateOfBirth}</p>
                    </div>

                    {/* Address */}
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                        {at.address}
                      </h4>
                      <p className="text-gray-800 font-medium text-left pl-7 leading-relaxed">
                        {at.addressValue}
                      </p>
                    </div>

                    {/* Mobile Number */}
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Phone className="h-5 w-5 text-orange-600 mr-2" />
                        {at.mobileNumber}
                      </h4>
                      <p className="text-gray-800 font-medium text-left pl-7">{scannedData?.mobileNumber}</p>
                    </div>

                    {/* Bank Account */}
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                        {at.bankAccount}
                      </h4>
                      <p className="text-gray-800 font-medium text-left pl-7">HDFC Bank - ****1234</p>
                      <p className="text-gray-600 text-sm text-left pl-7 mt-1">
                        {at.nameValue}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={onComplete}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12"
                >
                  {at.continueToApp}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return videoStates[0].completed || videoStates[0].error;
    if (currentStep === 1) return videoStates[1].completed || videoStates[1].error;
    if (currentStep === 2) return true; // Aadhaar scan step
    if (currentStep === 3) return true; // OTP verification step
    if (currentStep === 4) return true; // KYC completed step
    return false;
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
        {/* Global Language Toggle - Only for non-video steps */}
        {currentStep >= 2 && (
          <div className="absolute top-6 right-6 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 h-10 w-12 p-0 text-white flex flex-col items-center justify-center"
            >
              <div className="flex items-center space-x-0.5">
                <span className={`text-xs font-bold ${currentLanguage === 'te' ? 'text-yellow-300' : 'text-white'}`}>అ</span>
                <span className={`text-xs font-bold ${currentLanguage === 'en' ? 'text-yellow-300' : 'text-white'}`}>A</span>
              </div>
            </Button>
          </div>
        )}



        {/* Network Status Indicator */}
        {!isOnline && (
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center">
              <Wifi className="h-3 w-3 mr-1" />
              {currentLanguage === 'te' ? 'ఆఫ్‌లైన్' : 'Offline'}
            </div>
          </div>
        )}

        {/* Progress Bar - Fixed at top */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="w-full bg-black/50 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content - Full Screen */}
        <div className="relative h-screen">
          {renderStepContent()}
        </div>

        {/* Footer Button - Fixed at bottom - English labels only */}
        {(currentStep === 0 || currentStep === 1) && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-lg font-medium"
            >
              {currentStep === 0 ? 'Next' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}