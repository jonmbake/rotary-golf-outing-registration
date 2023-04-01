import Image from 'next/image'

interface Props {
  children?: JSX.Element
  subtitle: string
}

export default function Hero({ children, subtitle }: Props) {
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
      <h1>Madison West Middleton Rotary 2023 Golf Outing <br/> {subtitle}</h1>
      { children }
    </div>
  )
}