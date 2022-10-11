import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/upi.scss';
import Button from './Button';
import { handleGameInvitation } from './game/GameTabs';
import { globalContext } from './util';

const UserProfileIcon = (props: any) => {
	const { className, image, style, navigater, username, userid } = props;
	const { setChatIsOpen } = useContext(globalContext);
	const loc = useLocation();
	return (
		<>
			<div className={"c_upi flex-center " + (className ? className : "")} style={{ position: "relative" }}>
				<div className="button_list flex-column-center" style={{
						position: "absolute"
					}
				}>
					<Button className='vp' onClick={() => {
						setChatIsOpen(false);
						navigater(`/profile/${encodeURIComponent(username)}`)
					}}>View Profile</Button>
					<Button className='itp' onClick={() => {
						setChatIsOpen(false);
						handleGameInvitation(navigater, userid, loc);
					}}>Invite To Play</Button>
				</div>
				<div className="image d100"
					style={
						{
							...style,
							backgroundImage: `url(${image})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							backgroundColor: "white"
						}
					}
				>
				</div>
			</div>
		</>
	)
}

export default UserProfileIcon;