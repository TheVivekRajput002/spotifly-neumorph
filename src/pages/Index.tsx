import MusicPlayer from '@/components/MusicPlayer';
import ProductivityTimer from '@/components/ProductivityTimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Productivity Suite</h1>
        <p className="text-muted-foreground">Music player and Pomodoro timer for focused work sessions</p>
      </div>
      
      <div className="flex flex-wrap items-start justify-center gap-8 max-w-6xl mx-auto">
        <MusicPlayer />
        <ProductivityTimer />
      </div>
    </div>
  );
};

export default Index;
