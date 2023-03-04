import Image from 'next/image'

interface Props {
  children: JSX.Element
}

export default function Hero({ children }: Props) {
  return (
    <div className="py-5 text-center">
      <Image
        className="d-block mx-auto mb-4"
        src="/mwm-rotary-logo.png"
        alt="MWM Rotary Logo"
        width={250}
        height={75}
        priority
      />
      <h1>Madison West Middleton Rotary 2023 Golf Outing <br/> Golf and Sponsorship Registration</h1>
      { children}
    </div>
  )
}