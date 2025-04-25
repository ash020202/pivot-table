import excelIcon from "../../assets/excel_file_icon.svg";
import csvIcon from "../../assets/csv_file_icon.svg";

const FileIcons = () => {
  return (
    <div className="flex items-end p-2">
      <img height="40" width="40" src={excelIcon} alt="" />
      <p className="font-semibold text-[14px]">OR</p>
      <img height="40" width="40" src={csvIcon} alt="" />
    </div>
  );
};

export default FileIcons;
