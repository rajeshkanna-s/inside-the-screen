import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const videos = [
  {
    file: `${import.meta.env.BASE_URL}media/camera.mp4`,
    label: 'Push / Through glass',
    title: 'A camera move that turns a laptop into a portal'
  }
];

const work = ['Field Notes', 'Material Study', 'Open Edition'];

function App() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeStudy, setActiveStudy] = useState(0);

  const videoRefs = useRef([]);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('in');
        });
      },
      { threshold: 0.16 }
    );
    els.forEach(x => io.observe(x));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const activeEl = videoRefs.current[currentVideo];
    if (activeEl) {
      activeEl.currentTime = 0;
      if (isPlaying) {
        const playPromise = activeEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            activeEl.muted = true;
            setIsMuted(true);
            activeEl.play().catch(() => {});
          });
        }
      }
    }
    videoRefs.current.forEach((el, idx) => {
      if (idx !== currentVideo && el) {
        el.pause();
        el.currentTime = 0;
      }
    });
    setProgress(0);
  }, [currentVideo, isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const activeEl = videoRefs.current[currentVideo];
    if (activeEl && activeEl.duration) {
      const pct = (activeEl.currentTime / activeEl.duration) * 100;
      setProgress(pct);
    }
  }, [currentVideo]);

  const handleVideoEnded = useCallback(() => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  }, []);

  const selectVideo = idx => {
    setCurrentVideo(idx);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const activeEl = videoRefs.current[currentVideo];
    if (!activeEl) return;
    if (isPlaying) {
      activeEl.pause();
      setIsPlaying(false);
    } else {
      activeEl.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach(el => {
      if (el) el.muted = nextMuted;
    });
  };

  const nextVideo = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideo(prev => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <main>
      <header className="nav">
        <a className="mark" href="#top">
          INSIDE<span>®</span>
        </a>
        <nav>
          <a href="#hero-stage">Hero Reel</a>
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a className="contact" href="mailto:hello@studio.example">
            Start a project ↗
          </a>
        </nav>
      </header>

      {/* FULL VIEW AUTOMATIC HERO SECTION */}
      <section id="top" className="hero-fullscreen">
        <div className="hero-video-stage" id="hero-stage">
          {videos.map((v, i) => (
            <div
              key={v.file}
              className={`hero-video-slide ${i === currentVideo ? 'active' : ''}`}
            >
              <video
                ref={el => (videoRefs.current[i] = el)}
                src={v.file}
                autoPlay
                muted={isMuted}
                playsInline
                loop={videos.length === 1}
                onEnded={handleVideoEnded}
                onTimeUpdate={i === currentVideo ? handleTimeUpdate : undefined}
              />
            </div>
          ))}
          <div className="hero-overlay" />
          <div className="hero-grain" />
        </div>

        <div className="hero-content">
          <div className="hero-badge-row">
            <span className="live-dot" />
            <span className="live-label">AUTOMATIC HERO REEL</span>
            <span className="live-divider">•</span>
            <span className="live-reel-count">
              STUDY 0{currentVideo + 1} / 0{videos.length}
            </span>
            <span className="live-now-playing">
              {videos[currentVideo]?.label}
            </span>
          </div>

          <h1 className="hero-headline">
            Enter the frame.
            <br />
            <em>SCREEN</em>
          </h1>

          <p className="hero-dek">
            A full-view cinematic interaction portfolio about the charged moment
            when a digital product transforms into a visceral physical experience.
          </p>

          <div className="hero-deck">
            <div className="hero-playlist">
              {videos.map((v, i) => (
                <button
                  key={v.file}
                  type="button"
                  onClick={() => selectVideo(i)}
                  className={`hero-tab ${i === currentVideo ? 'active' : ''}`}
                >
                  <div className="tab-progress-track">
                    <div
                      className="tab-progress-bar"
                      style={{
                        width:
                          i === currentVideo
                            ? `${progress}%`
                            : i < currentVideo
                            ? '100%'
                            : '0%'
                      }}
                    />
                  </div>
                  <div className="tab-info">
                    <span className="tab-num">0{i + 1}</span>
                    <div className="tab-meta">
                      <span className="tab-label">{v.label}</span>
                      <span className="tab-title">{v.title}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="hero-controls">
              <button
                type="button"
                className="ctrl-btn"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                type="button"
                className="ctrl-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? '🔇 Muted' : '🔊 Sound On'}
              </button>
              <div className="ctrl-nav-group">
                <button
                  type="button"
                  className="ctrl-arrow-btn"
                  onClick={prevVideo}
                  title="Previous Video"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="ctrl-arrow-btn"
                  onClick={nextVideo}
                  title="Next Video"
                >
                  →
                </button>
              </div>
              <a className="hero-scroll-link" href="#statement">
                Explore <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="statement" className="statement reveal">
        <p className="kicker">The point of view</p>
        <h2>
          Details that stay
          <br />
          <i>with you.</i>
        </h2>
        <p className="statement-text">
          We build identities, spaces, and objects with enough tension to make
          people look twice — then stay awhile.
        </p>
      </section>

      <section id="work" className="work">
        <div className="section-head">
          <p className="kicker">Selected studies</p>
          <p className="counter">0{videos.length} / 0{videos.length}</p>
        </div>
        <div className="project-stack">
          {videos.map((v, i) => (
            <article
              className="project reveal"
              key={v.file}
              onMouseEnter={() => setActiveStudy(i)}
            >
              <div
                className="project-media"
                onClick={() => {
                  selectVideo(i);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
                title="Click to view full screen in hero"
              >
                <video
                  src={v.file}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={`${import.meta.env.BASE_URL}images/poster.svg`}
                />
                <div className="media-overlay">
                  <span>View in Hero Full View 0{i + 1}</span>
                  <b>↗</b>
                </div>
              </div>
              <div className="project-meta">
                <span className="project-no">0{i + 1}</span>
                <div>
                  <h3>{v.label}</h3>
                  <p>{v.title}</p>
                </div>
                <span className="arrow">↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about reveal">
        <div>
          <p className="kicker">Studio note</p>
          <h2>
            Less noise.
            <br />
            <i>More signal.</i>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            Small by design, collaborative by nature. We partner with founders
            and cultural teams to make work that feels considered from the first
            frame to the last.
          </p>
          <div className="services">
            <span>Identity</span>
            <span>Digital</span>
            <span>Direction</span>
            <span>Objects</span>
          </div>
        </div>
      </section>

      <section className="archive reveal">
        <p className="kicker">Archive / 2023—26</p>
        <div className="archive-list">
          {work.map((x, i) => (
            <div key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <i>View case ↗</i>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-title">INSIDE / THE SCREEN</div>
        <div>
          <a href="mailto:hello@studio.example">hello@studio.example</a>
          <p>Based anywhere. Working everywhere.</p>
        </div>
        <a href="#top" className="top">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);