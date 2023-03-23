import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../app/hooks"
import { selectCurrentToken } from "../features/auth/authSlice"

interface IProtectedRouteProps {
    children: JSX.Element;
    renavigate: string;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({children, renavigate }) => {
    const token = useAppSelector(selectCurrentToken)
    return token ? children : <Navigate to={renavigate} replace/>
}

export default ProtectedRoute