import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoonIcon, SunIcon, WalletIcon, CloudUploadIcon, CheckCircleIcon } from "lucide-react";
import Image from 'next/image';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    setIsSubmitEnabled(beforePhoto && afterPhoto && wallet);
  }, [beforePhoto, afterPhoto, wallet]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleFileUpload = (event, setPhoto) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const connectWallet = async (type) => {
    try {
      let provider;
      if (type === 'metamask' && window.ethereum) {
        provider = window.ethereum;
      } else {
        throw new Error('Wallet not installed');
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
      setShowWalletDropdown(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const removeImage = (setPhoto) => {
    setPhoto(null);
  };

  const submitTransformation = async () => {
    alert("Transformation Submitted & Verified. Base will be Credited Soon to your Wallet. #Based!");
  };

  return (
    <div className={`min-h-screen text-gray-100 theme-${theme}`}>
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm">Base Sepolia</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {showWalletDropdown && (
        <div className="fixed top-20 right-4 bg-black/90 rounded-xl p-2 z-50 border border-blue-500/30">
          <div className="space-y-2">
            {['metamask', 'coinbase', 'phantom'].map((walletType) => (
              <Button
                key={walletType}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => connectWallet(walletType)}
              >
                <Image
                  src={`/${walletType}-logo.svg`}
                  alt={walletType}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {walletType.charAt(0).toUpperCase() + walletType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 heading-font gradient-text">
            Transform & Earn
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Share your authentic fitness journey and earn up to 1 BASE token. AI-verified transformations only.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {['before', 'after'].map((type) => (
            <Card key={type} className="bg-black/60 backdrop-blur-md p-6 border-blue-500/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                {type === 'before' ? 'Before Photo' : 'After Photo'}
              </h3>
              <div
                onClick={() => document.getElementById(`${type}Input`).click()}
                className="upload-preview aspect-square bg-black/50 rounded-xl flex items-center justify-center cursor-pointer border-2 border-dashed border-blue-500/30"
              >
                {type === 'before' ? beforePhoto : afterPhoto ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={type === 'before' ? beforePhoto : afterPhoto}
                      alt={`${type} photo`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(type === 'before' ? setBeforePhoto : setAfterPhoto);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <CloudUploadIcon className="w-12 h-12 text-blue-500" />
                    <p className="mt-4">Click to upload {type} photo</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id={`${type}Input`}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, type === 'before' ? setBeforePhoto : setAfterPhoto)}
              />
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
          <Button
            className="w-full text-xl"
            onClick={() => setShowWalletDropdown(true)}
            disabled={wallet}
          >
            {wallet ? (
              <>
                <CheckCircleIcon className="mr-2" />
                Connected: {`${wallet.slice(0, 6)}...${wallet.slice(-4)}`}
              </>
            ) : (
              <>
                <WalletIcon className="mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
          <Button
            className="w-full text-xl"
            onClick={submitTransformation}
            disabled={!isSubmitEnabled}
          >
            Submit Transformation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default App;
