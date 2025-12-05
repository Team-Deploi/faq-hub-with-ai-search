// eslint-disable-next-line react/prop-types
export const JsonPreview = ({document}) => <pre>{JSON.stringify(document.displayed, null, 2)}</pre>
