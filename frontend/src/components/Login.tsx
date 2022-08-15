import "../styles/login.scss"
import Button from "./Button";
import _42logo from "../img/42_Logo.svg.png"
// import env from "react-dotenv";
import { useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import { cookies, globalContext, ShowConditionally, useEffectOnce } from "./util";
import loadingGif from '../img/loading.gif'

const api_link = "https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code"

const Login = () => {
	const [query, setQuery] = useSearchParams();
	const { loggedIn, setLoggedIn } = useContext(globalContext);
	let code = query.get('code')
	useEffectOnce(() => {
		if (code) {
			axios.get("http://localhost:3005/auth/login?code=" + code, { withCredentials: true, headers: { "same-site": "none" } } ).then((res) => {
				console.log(res);
				console.log(res.headers);
				console.log(res.headers['set-cookie']);
				console.log(cookies.get("_token"));
				if (cookies.get("_token")) {
					cookies.setFromObj(res.data, "/");
					setLoggedIn(true);
				}
			}).catch((err) => {
				console.log(err);
			})
		}
	});
	return (
		<div className="c_login flex-center">
			<div className="background d100">
				<div className="tint d100 flex-center-column flex-gap50">
					<h1 className="title">
						PONG
					</h1>
					<ShowConditionally cond={code}>
						<img src={loadingGif} alt="" className="loading spin" />
						<a href={api_link} className="no-underline">
							<Button className="authorize flex-center flex-gap5">
								<span className="text">
									Login in with Intra
								</span>
								<img src={_42logo} alt="42 Logo" className='_42icon' />
							</Button>
						</a>
					</ShowConditionally>
				</div>
			</div>
		</div>
	);
}

export default Login;