interface Props {
  numberOfGolfers: number;
}

export default function GolferInfo({ numberOfGolfers }: Props) {
  return (
    <>
      <div className="alert alert-info" role="alert">
        Please provide golfers&apos; names and emails if known now, at time of registration. If golfers are not yet known, leave the name and email fields blank, and we will follow up for golfer details closer to the golf outing time.
      </div>
      {Array(numberOfGolfers).fill(1).map((_, index) => {
        return (
          <div key={index}>
            {index % 4 === 0 && (
              <h2 className="team-header">Golf Team #{Math.floor(index / 4) + 1}</h2>
            )}
            <h3>Golfer #{index + 1}</h3>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name={"golfer" + (index + 1) + "_name"} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name={"golfer" + (index + 1) + "_email"} />
              <div className="form-text">Email address will be used to send golf outing updates.</div>
            </div>
          </div>
        );
      })}
    </>
  );
}