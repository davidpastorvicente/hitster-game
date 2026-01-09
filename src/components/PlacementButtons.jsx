import './PlacementButtons.css';

export default function PlacementButtons({ timeline, onPlacement }) {
  if (timeline.length === 0) {
    return (
      <div className="placement-buttons">
        <button 
          className="placement-button first"
          onClick={() => onPlacement(0)}
        >
          Place as First Song
        </button>
      </div>
    );
  }

  const positions = [];
  
  positions.push({
    label: `Before ${timeline[0].year}`,
    position: 0,
    type: 'before'
  });

  for (let i = 0; i < timeline.length - 1; i++) {
    positions.push({
      label: `Between ${timeline[i].year} - ${timeline[i + 1].year}`,
      position: i + 1,
      type: 'between'
    });
  }

  positions.push({
    label: `After ${timeline[timeline.length - 1].year}`,
    position: timeline.length,
    type: 'after'
  });

  return (
    <div className="placement-buttons">
      <p className="placement-instruction">Where does this song belong in your timeline?</p>
      <div className="button-grid">
        {positions.map((pos, index) => (
          <button
            key={index}
            className={`placement-button ${pos.type}`}
            onClick={() => onPlacement(pos.position)}
          >
            {pos.label}
          </button>
        ))}
      </div>
    </div>
  );
}
