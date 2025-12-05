import {useDocumentOperation, useClient} from 'sanity'

export function createClearSubcategoryPublishAction(originalPublishAction) {
  const CustomPublishAction = (props) => {
    // Call hooks at the component level
    const {patch} = useDocumentOperation(props.id, props.type)
    const client = useClient({apiVersion: '2024-06-01'})
    const originalResult = originalPublishAction(props)

    return {
      ...originalResult,
      onHandle: async () => {
        const draft = props.draft

        // Check if both category and subcategory exist
        if (draft?.category && draft?.subCategory) {
          // Fetch the subcategory to check its parent reference
          const subCategory = await client.fetch(`*[_id == $subCategoryId][0]{parent}`, {
            subCategoryId: draft.subCategory._ref,
          })

          // If subcategory's parent doesn't match the selected category, clear it
          if (subCategory?.parent?._ref !== draft.category._ref) {
            await patch.execute([{unset: ['subCategory']}])
          }
        }

        // Also clear subcategory if category was removed
        if (!draft?.category && draft?.subCategory) {
          await patch.execute([{unset: ['subCategory']}])
        }

        // Then delegate to original publish handler
        originalResult.onHandle()
      },
    }
  }
  return CustomPublishAction
}
