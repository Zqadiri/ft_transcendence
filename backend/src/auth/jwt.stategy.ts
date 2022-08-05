import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

function cookieExtractor(req) : string {
	var token = null;
	console.log(` return ${req.headers.cookie}`);
	if (req && req.headers.cookie){
		token = req.headers.cookie
		.split(';')
		.find((cookie: string) => cookie.startsWith('_token'))
		.split('=')[1]
	}
	console.log(` EXTRACT [${token}]`);
	return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

	/*
		TODO: jwtFromRequest parameter
		specifies the method using which we will extract the JWT from the request
	*/

	constructor(
		private  readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
			ignoreExpiration: false,
			secretOrKey: String(process.env.JWT_SECRET_KEY),
		})
	}

	/*
		TODO: validate
		simply return the user object
		Passport attaches this user object to the Request object
	*/

	async validate(payload: any) {
		console.log(`VALIDATE : ${payload.id}`);
		const user = await this.userService.getUserById(payload.id);
		if (!user)
			return ;
		return user;
	}
}
