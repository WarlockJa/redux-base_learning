import "./deleteuserconfirm.css";

const DeleteUserConfirm = ({
  callback,
  t,
}: {
  callback: (res: boolean) => void;
  t: (text: string) => string;
}) => {
  return (
    <section className="deleteUser">
      <h2>{t("user_deleteConfirm")}</h2>
      <div className="deleteUser--buttonsBlock">
        <button onClick={() => callback(true)}>{t("yes")}</button>
        <button onClick={() => callback(false)}>{t("no")}</button>
      </div>
    </section>
  );
};

export default DeleteUserConfirm;
