
interface Props {
    msg: string
}
export const ActionMsg = ({ msg }: Props) => {
    return (
        <section className="action-msg">
            <h3>{msg}</h3>
        </section>
    )
}