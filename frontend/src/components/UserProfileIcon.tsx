import '../styles/upi.scss';

const UserProfileIcon = ({avatar, width, height, className}: {avatar: string, width: any | undefined, height: any | undefined, className: string | undefined}) => {
	return (
		<>
			<div className={"c_upi flex-center " + (className ? className : "")}>
				<div className="image" style={{
					backgroundImage: `url(${avatar})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					width, height
				}}>
				</div>
			</div>
		</>
	)
}

UserProfileIcon.defaultProps = {
	width: undefined,
	height: undefined,
	className: undefined,
	avatar: ""
}

export default UserProfileIcon;