'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, Sparkles, PartyPopper, Heart, Wand2, Loader2 } from 'lucide-react';

type FilterType = 'none' | 'mustache' | 'neon' | 'pixel' | 'flare';

const filters = [
  { id: 'none' as FilterType, name: 'Original', emoji: '📸' },
  { id: 'mustache' as FilterType, name: 'Mustache & Monocle', emoji: '🎩' },
  { id: 'neon' as FilterType, name: 'Neon Dog', emoji: '🌈' },
  { id: 'pixel' as FilterType, name: 'Pixel Vomit', emoji: '🎮' },
  { id: 'flare' as FilterType, name: '1990s Lens Flare', emoji: '✨' },
];

export default function PostcardPoodle() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [message, setMessage] = useState('Wish you were here! 🐾');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    
    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterType: selectedFilter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate message');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error generating message:', error);
      setGenerateError(error instanceof Error ? error.message : 'Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (selectedFilter) {
      case 'neon':
        // Neon effect - boost colors and add glow
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.5);     // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.3); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.8); // Blue
        }
        break;
      case 'pixel':
        // Pixelation effect
        const pixelSize = 8;
        for (let y = 0; y < height; y += pixelSize) {
          for (let x = 0; x < width; x += pixelSize) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Fill pixel block with average color
            for (let py = 0; py < pixelSize && y + py < height; py++) {
              for (let px = 0; px < pixelSize && x + px < width; px++) {
                const pi = ((y + py) * width + (x + px)) * 4;
                data[pi] = r;
                data[pi + 1] = g;
                data[pi + 2] = b;
              }
            }
          }
        }
        break;
      case 'flare':
        // Vintage/washed out effect
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2 + 30);
          data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 20);
          data[i + 2] = Math.min(255, data[i + 2] * 0.9 + 40);
        }
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawMustacheOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (selectedFilter === 'mustache') {
      // Draw mustache
      ctx.fillStyle = '#000000';
      const mustacheY = height * 0.55;
      const mustacheWidth = width * 0.3;
      const mustacheHeight = height * 0.08;
      
      ctx.beginPath();
      ctx.ellipse(width * 0.4, mustacheY, mustacheWidth * 0.5, mustacheHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.ellipse(width * 0.6, mustacheY, mustacheWidth * 0.5, mustacheHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw monocle
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width * 0.35, height * 0.4, width * 0.08, 0, Math.PI * 2);
      ctx.stroke();
      
      // Monocle chain
      ctx.beginPath();
      ctx.moveTo(width * 0.35 + width * 0.08, height * 0.4);
      ctx.lineTo(width * 0.5, height * 0.5);
      ctx.stroke();
    }
  };

  const drawLensFlare = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (selectedFilter === 'flare') {
      const gradient = ctx.createRadialGradient(width * 0.7, height * 0.3, 0, width * 0.7, height * 0.3, width * 0.4);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
      gradient.addColorStop(0.3, 'rgba(255, 200, 150, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Apply filter effects
        if (selectedFilter !== 'none') {
          applyFilter(ctx, canvas.width, canvas.height);
          drawMustacheOverlay(ctx, canvas.width, canvas.height);
          drawLensFlare(ctx, canvas.width, canvas.height);
        }
      };
      img.src = image;
    }
  }, [image, selectedFilter]);

  const downloadPostcard = () => {
    if (!image || !canvasRef.current) return;

    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    // Create postcard dimensions (standard postcard ratio)
    const postcardWidth = 1200;
    const postcardHeight = 800;
    finalCanvas.width = postcardWidth;
    finalCanvas.height = postcardHeight;

    // Draw postcard background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, postcardWidth, postcardHeight);

    // Draw border
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, postcardWidth - 40, postcardHeight - 40);

    // Draw filtered image
    const imageWidth = postcardWidth - 100;
    const imageHeight = postcardHeight - 200;
    ctx.drawImage(canvasRef.current, 50, 50, imageWidth, imageHeight);

    // Draw message area
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(50, postcardHeight - 130, postcardWidth - 100, 80);
    
    // Draw message text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(message, postcardWidth / 2, postcardHeight - 75);

    // Add cute paw print
    ctx.font = '24px sans-serif';
    ctx.fillText('🐾', postcardWidth - 100, postcardHeight - 75);

    // Download
    const link = document.createElement('a');
    link.download = 'postcard-poodle.png';
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-playful-gradient-alt py-8 px-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🎈</div>
      <div className="absolute top-20 right-20 text-5xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>🎉</div>
      <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-10 right-10 text-5xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>🎨</div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl animate-bounce-gentle inline-block">🐩</span>
            <h1 className="text-6xl md:text-7xl font-extrabold animate-rainbow mb-0 text-balance">
              Postcard Poodle
            </h1>
            <span className="text-6xl animate-bounce-gentle inline-block" style={{ animationDelay: '0.3s' }}>🎴</span>
          </div>
          <p className="text-xl md:text-2xl text-foreground/90 font-semibold text-pretty mb-2">
            Transform your photos into whimsical postcards with silly filters! 🎨✨
          </p>
          <div className="flex items-center justify-center gap-2 text-2xl mt-3">
            <span className="animate-float">🎭</span>
            <span className="animate-float" style={{ animationDelay: '0.2s' }}>🌈</span>
            <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎪</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Upload & Filters */}
          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-pink-300 rounded-3xl shadow-playful hover-lift">
              <h2 className="text-3xl font-extrabold text-foreground mb-5 flex items-center gap-3">
                <Upload className="w-8 h-8 text-pink-500 animate-bounce-gentle" />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  Upload Photo
                </span>
                <span className="text-3xl">📸</span>
              </h2>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-4 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-pink-500 bg-gradient-to-br from-pink-100 to-purple-100 scale-105 shadow-playful-lg'
                    : 'border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 hover:scale-[1.02]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <div className="space-y-3">
                  <div className="text-6xl animate-bounce-gentle">📸</div>
                  <p className="text-foreground font-bold text-lg">
                    Click or drag an image here! 🎯
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    JPG or PNG files accepted ✨
                  </p>
                </div>
              </div>
            </Card>

            {/* Filter Selection */}
            {image && (
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-purple-300 rounded-3xl shadow-playful hover-lift">
                <h2 className="text-3xl font-extrabold text-foreground mb-5 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-500 animate-pulse-glow" />
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    Choose Your Vibe
                  </span>
                  <span className="text-3xl animate-spin-slow">✨</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      className={`h-auto py-5 px-4 flex flex-col items-center gap-3 rounded-2xl transition-all duration-300 hover-lift hover-bounce ${
                        selectedFilter === filter.id
                          ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white border-4 border-pink-400 shadow-playful-lg scale-105'
                          : 'bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50'
                      }`}
                      onClick={() => setSelectedFilter(filter.id)}
                    >
                      <span className={`text-4xl ${selectedFilter === filter.id ? 'animate-bounce-gentle' : ''}`}>
                        {filter.emoji}
                      </span>
                      <span className={`text-sm font-bold text-center leading-tight ${
                        selectedFilter === filter.id ? 'text-white' : 'text-foreground'
                      }`}>
                        {filter.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Message Input */}
            {image && (
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-orange-300 rounded-3xl shadow-playful hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="message" className="text-2xl font-extrabold text-foreground flex items-center gap-2 block">
                    <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
                    <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      Your Message
                    </span>
                  </Label>
                  <Button
                    onClick={handleGenerateMessage}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something fun! 🎉"
                  className="text-lg border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all"
                  maxLength={60}
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <span className="text-pink-500">{message.length}</span>
                    <span>/</span>
                    <span className="text-purple-500">60</span>
                    <span className="ml-2">characters ✍️</span>
                  </p>
                  {generateError && (
                    <p className="text-xs text-destructive">
                      {generateError}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-blue-300 rounded-3xl shadow-playful hover-lift">
              <h2 className="text-3xl font-extrabold text-foreground mb-5 flex items-center gap-3">
                <span className="text-3xl animate-wiggle">👀</span>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Preview
                </span>
              </h2>
              
              {!image ? (
                <div className="aspect-[3/2] rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center border-4 border-dashed border-blue-300">
                  <div className="text-center space-y-3">
                    <div className="text-7xl animate-bounce-gentle">🎨</div>
                    <p className="text-foreground font-bold text-lg">
                      Your postcard will appear here! 🎴
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload an image to get started ✨
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Canvas for filtered image (hidden) */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Postcard Preview */}
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-4 border-pink-400 rounded-3xl p-5 shadow-playful-lg hover-lift">
                    <div className="border-4 border-purple-300 rounded-2xl overflow-hidden bg-white">
                      <div className="relative aspect-[3/2] bg-gradient-to-br from-blue-100 to-purple-100">
                        {selectedFilter !== 'none' && canvasRef.current ? (
                          <img
                            src={canvasRef.current.toDataURL() || image}
                            alt="Filtered preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-5 text-center border-t-4 border-purple-300">
                        <p className="font-extrabold text-xl text-foreground flex items-center justify-center gap-2">
                          <span className="text-2xl">💌</span>
                          {message}
                          <span className="text-2xl">🐾</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadPostcard}
                    size="lg"
                    className="w-full text-xl font-extrabold py-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white border-4 border-pink-400 shadow-playful-lg hover-lift hover-bounce transition-all duration-300"
                  >
                    <Download className="w-6 h-6 mr-2 animate-bounce-gentle" />
                    Download My Postcard! 🎉
                  </Button>
                </div>
              )}
            </Card>

            {/* Fun Stats */}
            {image && (
              <Card className="p-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 border-4 border-yellow-400 rounded-3xl shadow-playful">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-3xl mb-2">
                    <PartyPopper className="w-6 h-6 text-pink-500 animate-wiggle" />
                    <span className="animate-bounce-gentle">🎊</span>
                    <span className="animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>🎉</span>
                    <PartyPopper className="w-6 h-6 text-purple-500 animate-wiggle" style={{ animationDelay: '0.1s' }} />
                  </div>
                  <p className="text-lg font-extrabold text-foreground">
                    ✨ Ready to share your masterpiece! ✨
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Perfect for social media 📱, email 📧, or printing 🖨️
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
