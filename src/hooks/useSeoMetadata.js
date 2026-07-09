import { useCallback, useMemo, useState } from "react";
import { buildMetadata } from "../utils/metadataText";

const EMPTY_INFO = {
  businessName: "",
  primaryService: "",
  city: "",
  additionalKeywords: "",
};

// Manages the business-info fields and the final metadata that gets embedded.
// Title and description are auto-generated but can be manually overridden;
// an override of null means "use the auto-generated value".
export function useSeoMetadata() {
  const [businessInfo, setBusinessInfo] = useState(EMPTY_INFO);
  const [titleOverride, setTitleOverride] = useState(null);
  const [descriptionOverride, setDescriptionOverride] = useState(null);

  const setField = useCallback((field, value) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const generated = useMemo(() => buildMetadata(businessInfo), [businessInfo]);

  const metadata = useMemo(
    () => ({
      title: titleOverride ?? generated.title,
      description: descriptionOverride ?? generated.description,
      keywords: generated.keywords,
      author: generated.author,
    }),
    [generated, titleOverride, descriptionOverride]
  );

  return {
    businessInfo,
    setField,
    metadata,
    setTitleOverride,
    setDescriptionOverride,
    resetTitle: useCallback(() => setTitleOverride(null), []),
    resetDescription: useCallback(() => setDescriptionOverride(null), []),
    isTitleEdited: titleOverride !== null,
    isDescriptionEdited: descriptionOverride !== null,
  };
}
