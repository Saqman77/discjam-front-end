import MainCta from "@components/buttons/maincta/MainCta"
import PreScreen from "./prescreen/PreScreen"


const Home = () => {
  return (
    <div className="main-container">
      <div className="cta-container">
        <MainCta/>
      </div>
      <PreScreen/>
    </div>
  )
}

export default Home