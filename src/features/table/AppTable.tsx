import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoReload } from "react-icons/io5";

import { GRID_COL_SIZES } from "../../utils/constants";
import { useSort } from "../../hooks/useSort";
import { useAppContext } from "../../context/useAppContext";

import TableRow from "./TableRow";
import Table from "../../ui/Table";
import RefreshIcon from "./RefreshIcon";
import IndeterminateCheckbox from "../../ui/IndeterminateCheckbox";
import TotalPersons from "../footer/TotalPersons";
import PageCount from "../footer/PageCount";
import FooterPaginationButtonsComponent from "../footer/FooterPaginationButtonsComponent";
import SortableHeader from "../../ui/SortableHeader";
import Menus from "../../ui/Menus";

function AppTable() {
  // Context
  const { data, refreshLoading, refreshData, ShowPersonsPerPageValue } =
    useAppContext();

  // React Router, search params
  const [searchParams] = useSearchParams();

  //to redirect to the first page when the page is refreshed
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.search === "") {
      navigate("/?show=25&page=1", { replace: true });
    }
  }, [navigate, location]);

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const indexOfLastPerosn = page * ShowPersonsPerPageValue;
  const indexOfFirstPerson = indexOfLastPerosn - ShowPersonsPerPageValue;

  //Sorting
  const { sortedData, handleSort } = useSort(data, "fullName", "asc");
  const currentData = sortedData.slice(indexOfFirstPerson, indexOfLastPerosn);

  return (
    <Menus>
      <Table columns={GRID_COL_SIZES}>
        <Table.Header>
          <IndeterminateCheckbox />
          <SortableHeader field="fullName" handleSort={handleSort}>
            Full name / Health check
          </SortableHeader>
          <SortableHeader field="combinedStatus" handleSort={handleSort}>
            Code
          </SortableHeader>
          <SortableHeader field="dateCount" handleSort={handleSort}>
            Expiration
          </SortableHeader>
          <SortableHeader field="dateCount" handleSort={handleSort}>
            Status
          </SortableHeader>
          <SortableHeader field="department" handleSort={handleSort}>
            Department
          </SortableHeader>
          <SortableHeader field="status" handleSort={handleSort}>
            User status
          </SortableHeader>
          <SortableHeader field="jobTitle" handleSort={handleSort}>
            Job title
          </SortableHeader>
          <RefreshIcon onClick={refreshData} isLoading={refreshLoading}>
            <IoReload />
          </RefreshIcon>
        </Table.Header>
        <Table.Body
          data={currentData}
          render={(item) => <TableRow key={item.id} person={item} />}
        />
        <Table.Footer>
          <TotalPersons />
          <PageCount />
          <FooterPaginationButtonsComponent />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default AppTable;
