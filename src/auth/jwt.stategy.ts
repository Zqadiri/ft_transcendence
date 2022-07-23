import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {

	/*
		TODO: jwtFromRequest parameter
		specifies the method using which we will extract the JWT from the request
	*/

	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: `${process.env.JWT_SECRET_KEY}`,
		})
	}

	/*
		TODO: validate
		simply return the user object
		Passport attaches this user object to the Request object
	*/

	async validate(payload: any) {
		return {id: payload.sub, username: payload.username}
	}
}
