import { MouseEvent } from "react"
import { NavLink, useLocation } from "react-router-dom"
interface Route {
    location: string,
    icon: React.ReactNode,
    activeIcon: React.ReactNode,
    txt: string,
    isRendered: boolean,
}
interface Props {
    routes: Route[],
    onValidateLibrary: (ev: MouseEvent<HTMLAnchorElement>) => void
}
export const NavLinksList = ({ routes, onValidateLibrary }: Props) => {
    const location = useLocation()
    const isIconActive = (routeLocation: string) => {
        if (routeLocation === '/') {
            return location.pathname === '/'
        } else {
            return location.pathname.includes(routeLocation)
        }
    }
    return (
        <ul className="nav-links-main">
            {routes.map(({ location, isRendered, icon, activeIcon, txt }) => {
                if (isRendered) return (
                    <li>
                        <NavLink key={txt} onClick={(txt === 'Your Library') ? onValidateLibrary : () => { }} to={location} className='flex align-center'>
                            {isIconActive(location) ? <span>{activeIcon}</span> : <span>{icon}</span>}
                            <p>{txt}</p>
                        </NavLink>
                    </li>
                )
            })}
        </ul>
    )
}