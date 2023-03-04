interface Props {
  numberOfGolfers: number;
}

export default function GolferInfo( { numberOfGolfers }: Props) {
  return (
    <>
      {Array(numberOfGolfers).fill(1).map((_, index) => {
        return (
          <>
          <h3>Golfer #{index + 1}</h3>
          <div key={index} className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" required={true} className="form-control" name={"golfer" + index + "_name"} />
          </div>
          <div key={index} className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" required={true} className="form-control" name={"golfer" + index + "_email"} />
            <div className="form-text">Email address will be used to send golf outing updates.</div>
          </div>
          </>
        );
      })}
    </>
  );
}