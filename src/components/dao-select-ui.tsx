export type DaoSelectUiInput = {
  daos: {
    name: string;
    onSelect: () => void;
  }[];
  onSelectCreateDao: () => void;
};

export function DaoSelectUi({ daos, onSelectCreateDao }: DaoSelectUiInput) {
  // todo-riley
  return (
    <div>
      {/* for testing, simple comma-separated list of dao names */}
      {daos.map((dao) => dao.name).join(", ")}
    </div>
  );
}
