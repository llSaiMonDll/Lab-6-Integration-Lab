import { createContext } from 'react';
const GlobalContext = createContext();

// const globalContextValue = useMemo(() => {
//     return {
//         user,
//         setUser,
//         setStatus,
//     };
// }, [user]);

export default GlobalContext;