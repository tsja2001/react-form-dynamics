import { useState } from "react";

const useForseUpdate = () => {
	// eslint-disable-next-line no-unused-vars
	const [value, setValue] = useState(0);
	return () => setValue(value => ++value);
}

export default useForseUpdate
