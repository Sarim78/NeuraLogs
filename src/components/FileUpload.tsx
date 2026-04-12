import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploadProps {
  onUpload: (file: File) => void
  status: string
}

export default function FileUpload({ onUpload, status }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/zip": [".zip"] },
    multiple: false,
    disabled: status !== "idle" && status !== "error",
  })

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center
        w-full h-64 rounded-2xl border border-dashed
        cursor-pointer transition-all duration-200
        ${isDragActive
          ? "border-white bg-white/10"
          : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
        }
      `}
    >
      <input {...getInputProps()} />

      {status === "unzipping" && (
        <p className="text-white/60 text-sm">Extracting zip file...</p>
      )}
      {status === "parsing" && (
        <p className="text-white/60 text-sm">Parsing conversations...</p>
      )}
      {status === "clustering" && (
        <p className="text-white/60 text-sm">Clustering topics with Claude...</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">Something went wrong. Try again.</p>
      )}
      {(status === "idle" || status === "error") && (
        <>
          <p className="text-white/80 text-sm font-medium mb-1">
            {isDragActive ? "Drop your zip file here" : "Drag and drop your export zip"}
          </p>
          <p className="text-white/40 text-xs">
            Supports Claude and ChatGPT exports
          </p>
        </>
      )}
    </div>
  )
}