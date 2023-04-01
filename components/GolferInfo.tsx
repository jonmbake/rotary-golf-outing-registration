interface Props {
  numberOfGolfers: number;
}

export default function GolferInfo({ numberOfGolfers }: Props) {
  return (
    <>
      <div className="alert alert-info" role="alert">
      Please provide the golfers&apos; names and emails if known at the time of registration. If the golfers are not known, leave the fields blank, and we will follow up for golfer details closer to the golf outing time.
      </div>
      {Array(numberOfGolfers).fill(1).map((_, index) => {
        return (
          <>
          {index % 4 === 0 && (
            <h2 className="team-header">Golf Team #{Math.floor(index / 4) + 1}</h2>
          )}
          <h3>Golfer #{index + 1}</h3>
          <div key={index} className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name={"golfer" + (index + 1) + "_name"} />
          </div>
          <div key={index} className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name={"golfer" + (index + 1) + "_email"} />
            <div className="form-text">Email address will be used to send golf outing updates.</div>
          </div>
          </>
        );
      })}
    </>
  );
}