import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Neumorphic Music Player</h1>
        <p className="text-muted-foreground mb-8">A beautiful Spotify-style music player widget</p>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default Index;
