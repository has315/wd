
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useNotes } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv']
};

export default function DragDropUpload() {
  // const { upload } = useNotes();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Please upload only one file at a time");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const result = {
        content: `
        1,DD37Cf93aecA6Dc,Sheryl,Baxter,Rasmussen Group,East Leonard,Chile,229.077.5154,397.884.0519x718,zunigavanessa@smith.info,2020-08-24,http://www.stephenson.com/
2,1Ef7b82A4CAAD10,Preston,Lozano,Vega-Gentry,East Jimmychester,Djibouti,5153435776,686-620-1820x944,vmata@colon.com,2021-04-23,http://www.hobbs.com/
3,6F94879bDAfE5a6,Roy,Berry,Murillo-Perry,Isabelborough,Antigua and Barbuda,+1-539-402-0259,(496)978-3969x58947,beckycarr@hogan.com,2020-03-25,http://www.lawrence.com/
4,5Cef8BFA16c5e3c,Linda,Olsen,"Dominguez, Mcmillan and Donovan",Bensonview,Dominican Republic,001-808-617-6467x12895,+1-813-324-8756,stanleyblackwell@benson.org,2020-06-02,http://www.good-lyons.com/
5,053d585Ab6b3159,Joanna,Bender,"Martin, Lang and Andrade",West Priscilla,Slovakia (Slovak Republic),001-234-203-0635x76146,001-199-446-3860x3486,colinalvarado@miles.net,2021-04-17,https://goodwin-ingram.com/
6,2d08FB17EE273F4,Aimee,Downs,Steele Group,Chavezborough,Bosnia and Herzegovina,(283)437-3886x88321,999-728-1637,louis27@gilbert.com,2020-02-25,http://www.berger.net/
7,EA4d384DfDbBf77,Darren,Peck,"Lester, Woodard and Mitchell",Lake Ana,Pitcairn Islands,(496)452-6181x3291,+1-247-266-0963x4995,tgates@cantrell.com,2021-08-24,https://www.le.com/
8,0e04AFde9f225dE,Brett,Mullen,"Sanford, Davenport and Giles",Kimport,Bulgaria,001-583-352-7197x297,001-333-145-0369,asnow@colon.com,2021-04-12,https://hammond-ramsey.com/
9,C2dE4dEEc489ae0,Sheryl,Meyers,Browning-Simon,Robersonstad,Cyprus,854-138-4911x5772,+1-448-910-2276x729,mariokhan@ryan-pope.org,2020-01-13,https://www.bullock.net/
10,8C2811a503C7c5a,Michelle,Gallagher,Beck-Hendrix,Elaineberg,Timor-Leste,739.218.2516x459,001-054-401-0347x617,mdyer@escobar.net,2021-11-08,https://arias.com/
11,216E205d6eBb815,Carl,Schroeder,"Oconnell, Meza and Everett",Shannonville,Guernsey,637-854-0256x825,114.336.0784x788,kirksalas@webb.com,2021-10-20,https://simmons-hurley.com/`}
      // const result = await upload(formData);
      setNoteContent(result.content);
      setShowEditor(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }, []);
  // }, [upload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-invalid-type") {
        setError(`Invalid file type. Supported formats: PDF, TXT, CSV files`);
      } else if (error?.code === "too-many-files") {
        setError("Please upload only one file at a time");
      } else {
        setError("Invalid file. Please try again");
      }
    },
  });

  if (showEditor) {
    return (
      <div className="space-y-4">
        <textarea
          className="w-full min-h-[400px] p-4 border rounded-lg"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Save edited content
            setShowEditor(false);
          }}>
            Save & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Supported formats: PDF, TXT, CSV files
      </div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            {isUploading ? (
              <FileText className="h-12 w-12 text-primary animate-pulse" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Drop your notes here to create a new Wisdom Drop</h3>
            <p className="text-sm text-muted-foreground">
              Click to browse or drag and drop your file
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
