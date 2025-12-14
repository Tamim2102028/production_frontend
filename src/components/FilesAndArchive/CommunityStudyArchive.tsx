import StudyArchiveHeader from "./CommunityStudyArchive/StudyArchiveHeader";
import ArchiveTabs from "./CommunityStudyArchive/ArchiveTabs";
import FolderSection from "./CommunityStudyArchive/FolderSection";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  selectSelectedLevel,
  selectSelectedTerm,
  selectActiveArchiveTab,
  selectSearchQuery,
  selectLevels,
  selectTerms,
  setSelectedLevel,
  setSelectedTerm,
  setActiveArchiveTab,
  setSearchQuery
} from "../../store/slices/communityStudyArchiveSlice";

export default function CommunityStudyArchive() {
  const dispatch = useAppDispatch();
  
  // Redux state
  const selectedLevel = useAppSelector(selectSelectedLevel);
  const selectedTerm = useAppSelector(selectSelectedTerm);
  const activeArchiveTab = useAppSelector(selectActiveArchiveTab);
  const searchQuery = useAppSelector(selectSearchQuery);
  const levels = useAppSelector(selectLevels);
  const terms = useAppSelector(selectTerms);

  // Redux actions
  const handleSetSelectedLevel = (level: string) => dispatch(setSelectedLevel(level));
  const handleSetSelectedTerm = (term: string) => dispatch(setSelectedTerm(term));
  const handleSetActiveArchiveTab = (tab: "official" | "seniors" | "classmates") => dispatch(setActiveArchiveTab(tab));
  const handleSetSearchQuery = (query: string) => dispatch(setSearchQuery(query));

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <StudyArchiveHeader
        selectedLevel={selectedLevel}
        setSelectedLevel={handleSetSelectedLevel}
        selectedTerm={selectedTerm}
        setSelectedTerm={handleSetSelectedTerm}
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
        levels={levels}
        terms={terms}
      />

      {/* Archive Tabs */}
      <ArchiveTabs
        activeArchiveTab={activeArchiveTab}
        setActiveArchiveTab={handleSetActiveArchiveTab}
      />

      {/* Main Content - Folder Sections */}
      <FolderSection />
    </div>
  );
}
