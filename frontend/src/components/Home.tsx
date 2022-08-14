import "../styles/home.scss"
import { cookies } from "./util";

const Home = () => {
	return (
		<div className="c_home">
			<img src={cookies.get("avatar")} alt="avatar" className="avatar" />
			<h1>Welcome <span>{cookies.get("name")}</span></h1>
		</div>
	);
}

export default Home;