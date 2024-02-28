import React, { useEffect, useRef } from 'react';

const GanttChartCameraApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleVideoTimeUpdate = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (videoElement && canvasElement) {
      const context = canvasElement.getContext('2d');
      const time = videoElement.currentTime;

      // Draw the video onto the canvas
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      // Define the areas to be shifted horizontally (as rectangles)
      const shiftedAreas = [
        { x: 50, y: 50, width: 60, height:  50 },
        { x: 110, y: 100, width: 30, height: 50 },
        { x: 140, y: 150, width: 20, height: 50 },
        { x: 160, y: 200, width: 70, height: 50 },
        { x: 230, y: 250, width: 50, height: 50 },
        { x: 280, y: 300, width: 90, height: 50 },
        { x: 370, y: 350, width: 20, height: 50 },
        { x: 390, y: 400, width: 40, height: 50 },
        { x: 410, y: 450, width: 50, height: 50 },
        // Add more areas as needed
      ];

      // Save the original stream data for later use
      const originalImageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

      // Restore the original stream data in areas that should not be shifted
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      context.putImageData(originalImageData, 0, 0);

      // Apply the horizontal shift to specific areas
      shiftedAreas.forEach(area => {
        const imageData = context.getImageData(area.x, area.y, area.width, area.height);
        context.putImageData(imageData, area.x + 50, area.y);
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(handleVideoTimeUpdate, 100);
    return () => clearInterval(intervalId);
  }, []); // Add dependencies if necessary

  return (
      <div>
        <video
            ref={videoRef}
            autoPlay
            playsInline={false}
            muted
        />
        <canvas ref={canvasRef} width={800} height={600} />
      </div>
  );
};

export default GanttChartCameraApp;
