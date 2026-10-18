// Shown instantly on every client navigation inside (main) while the next route
// loads, so button clicks (View more, Go to album...) switch pages immediately.
// Reuses the existing shimmer classes from SubActivities.css (globally imported).
export default function Loading() {
  return (
    <div className="temple-page-bg">
      <div className="shimmer-activity-wrapper">
        <div className="shimmer" />
      </div>
      <div className="container py-5">
        <div className="row g-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <div className="shimmer-activity-wrapper" style={{ height: 220, borderRadius: 12 }}>
                <div className="shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
