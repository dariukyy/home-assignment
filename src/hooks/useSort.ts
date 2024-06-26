import { useState } from "react";
import { Person } from "../data/data";

// Define the types for the sorting function
export type SortingFunctionTypes =
  | "fullName"
  | "status"
  // | "statusOne"
  // | "statusTwo"
  // | "statusThree"
  | "dateCount"
  | "department"
  | "jobTitle"
  | "combinedStatus";

// Define the types for the sorting direction
export type SortingType = "asc" | "desc";

export function useSort(
  data: Person[],
  // Define the initial sort field and direction
  initialSortField: SortingFunctionTypes,
  initialSortDirection: SortingType
) {
  // Define the state for the sort field and direction
  const [sortField, setSortField] =
    useState<SortingFunctionTypes>(initialSortField);
  //
  const [sortDirection, setSortDirection] =
    useState<SortingType>(initialSortDirection);

  // Define the function to handle the sorting
  function handleSort(field: SortingFunctionTypes) {
    // If the field is the same as the current sort field, toggle the direction

    if (field === "combinedStatus") {
      setSortField("combinedStatus");
    } else {
      setSortField(field);
    }
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  }

  // Define the function to get the value of the field
  function getValue(person: Person, field: SortingFunctionTypes) {
    if (field === "dateCount") {
      return (["statusOne", "statusTwo", "statusThree"] as const).filter(
        (dateField) => new Date(person[dateField].date) > new Date()
      ).length;
    } else if (field === "combinedStatus") {
      return (
        Number(person["statusOne"].status) +
        Number(person["statusTwo"].status) * 1000 +
        Number(person["statusThree"].status) * 1000000
      );
    } else {
      return person[field];
    }
  }

  // Sort the data based on the sort field and direction

  const sortedData = [...data].sort((a, b) => {
    let aValue = getValue(a, sortField);
    let bValue = getValue(b, sortField);

    if (sortField === "dateCount") {
      aValue = (["statusOne", "statusTwo", "statusThree"] as const).filter(
        (dateField) => new Date(a[dateField].date) > new Date()
      ).length;
      bValue = (["statusOne", "statusTwo", "statusThree"] as const).filter(
        (dateField) => new Date(b[dateField].date) > new Date()
      ).length;
    }

    let comparison = 0;

    if (sortField === "status") {
      if (sortDirection === "asc") {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      } else {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      }
    } else {
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortDirection === "asc") {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = bValue.localeCompare(aValue);
        }
      } else if (sortField === "dateCount") {
        comparison =
          sortDirection === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
      }
    }

    // If the primary sort fields are equal, sort by full name
    if (comparison === 0) {
      // Always sort by full name in ascending order when the primary sort is in descending order
      comparison = a.fullName.localeCompare(b.fullName);
    }

    return comparison;
  });

  return { sortedData, handleSort };
}
