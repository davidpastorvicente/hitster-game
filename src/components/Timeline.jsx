import './Timeline.css';

export default function Timeline({ timeline, showYears }) {
  if (timeline.length === 0) {
    return (
      <div className="timeline empty">
        <p>No songs yet. Start building your timeline!</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {timeline.map((song, index) => (
        <div key={index} className="timeline-item">
          <div className="song-card">
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
              {showYears && <div className="song-year">{song.year}</div>}
            </div>
          </div>
          {index < timeline.length - 1 && (
            <div className="timeline-arrow">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
