import './maincta.scss';
const MainCta = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="main-cta" onClick={onClick}>
      BUY TICKETS
    </button>
  )
}

export default MainCta