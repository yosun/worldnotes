/**
 * Main application component for Splat and Treat.
 * Handles world selection and scene rendering.
 */
function App() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-halloween-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-halloween-orange mb-4">🎃 Splat and Treat 🎃</h1>
        <p className="text-gray-400">Explore Gaussian splat worlds and place 3D treats!</p>
        <p className="text-gray-500 mt-4 text-sm">World selection coming soon...</p>
      </div>
    </div>
  );
}

export default App;
