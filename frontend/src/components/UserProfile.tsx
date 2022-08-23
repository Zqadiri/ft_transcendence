import { useParams } from "react-router-dom";

const UserProfile = () => {
	let params = useParams();
	return (
		<>
			<h1>user profile of: {params.userId}</h1>
		</>
	);
}
 
export default UserProfile;