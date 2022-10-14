import "../styles/login.scss"
import Button from "./Button";
import _42logo from "../img/42_Logo.svg.png"
// import env from "react-dotenv";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { cookies, globalContext, ShowConditionally, useEffectOnce } from "./util";
import loadingGif from '../img/loading.gif'

const api_link = "/two-factor-authentication/authenticate"

const TwoFA = () => {
	const [query, setQuery] = useSearchParams();
	const { loggedIn, setLoggedIn } = useContext(globalContext);
	const [twoFacAuthCode, setTwoFacAuthCode] = useState("");
	const [message, setMessage] = useState("");
	let code = query.get('code')
	let navigater = useNavigate()
	return (
		<div className="c_login flex-center">
			<div className="background d100">
				<div className="tint d100 flex-center-column flex-gap50">
					<h1 className="title">
						PONG
					</h1>
					<div className="container flex-column-center flex-gap10">
						<input className="input" placeholder={message} type="password" value={twoFacAuthCode} onChange={(e) => { setTwoFacAuthCode(e.target.value) }}/>
						<Button onClick={() => {
							axios.post(api_link, { twoFacAuthCode }).then(() => {
								window.location.assign("/");
							}).catch((err) => {
								setMessage(err.response.data.message);
								setTwoFacAuthCode("");
							})
						}} className="authorize flex-center flex-gap5">
							<span className="text">
								Verify 2FA Code
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TwoFA;