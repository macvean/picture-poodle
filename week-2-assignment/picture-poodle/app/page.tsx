'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2 text-balance">
            Postcard Poodle 🐩
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Transform your photos into whimsical postcards with silly filters!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Upload & Filters */}
          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Photo
              </h2>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
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
                <div className="space-y-2">
                  <div className="text-4xl">📸</div>
                  <p className="text-foreground font-medium">
                    Click or drag an image here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    JPG or PNG files
                  </p>
                </div>
              </div>
            </Card>

            {/* Filter Selection */}
            {image && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Choose Your Vibe
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                      onClick={() => setSelectedFilter(filter.id)}
                    >
                      <span className="text-3xl">{filter.emoji}</span>
                      <span className="text-sm font-medium text-center leading-tight">
                        {filter.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Message Input */}
            {image && (
              <Card className="p-6">
                <Label htmlFor="message" className="text-lg font-bold text-foreground mb-3 block">
                  Your Message
                </Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something fun!"
                  className="text-lg"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {message.length}/60 characters
                </p>
              </Card>
            )}
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Preview
              </h2>
              
              {!image ? (
                <div className="aspect-[3/2] rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">🎨</div>
                    <p className="text-muted-foreground">
                      Your postcard will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Canvas for filtered image (hidden) */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Postcard Preview */}
                  <div className="bg-card border-4 border-border rounded-xl p-4 shadow-xl">
                    <div className="border-2 border-muted rounded-lg overflow-hidden">
                      <div className="relative aspect-[3/2]">
                        {canvasRef.current && (
                          <img
                            src={canvasRef.current.toDataURL() || "/placeholder.svg"}
                            alt="Filtered preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="bg-muted p-4 text-center">
                        <p className="font-bold text-lg text-foreground">
                          {message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadPostcard}
                    size="lg"
                    className="w-full text-lg font-bold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download My Postcard
                  </Button>
                </div>
              )}
            </Card>

            {/* Fun Stats */}
            {image && (
              <Card className="p-6 bg-accent/50">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-accent-foreground">
                    ✨ Ready to share your masterpiece!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Perfect for social media, email, or printing
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
