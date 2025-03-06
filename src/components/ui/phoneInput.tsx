import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Input } from "@/components/ui/input";
  import {
    CountryIso2,
    defaultCountries,
    FlagImage,
    parseCountry,
    usePhoneInput,
  } from "react-international-phone";
  import "react-international-phone/style.css";
  
  interface PhoneInputFieldProps {
    value: string;
    onChange: (phone: string) => void;
  }
  
  export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
    value = "",
    onChange,
  }) => {
    const {
      inputValue,
      handlePhoneValueChange,
      inputRef,
      country,
      setCountry,
    } = usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => onChange(data.phone),
      forceDialCode: true
    });
  
    return (
      <div className="flex items-center space-x-2">
        <Select
          value={country.iso2}
          onValueChange={(val) => setCountry(val as CountryIso2)}
        >
          <SelectTrigger className="w-20">
            <SelectValue>
              <FlagImage iso2={country.iso2} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {defaultCountries.map((c) => {
              const country = parseCountry(c);
              return (
                <SelectItem key={country.iso2} value={country.iso2}>
                  <div className="flex items-center space-x-2">
                    <FlagImage iso2={country.iso2} />
                    <span>{country.name}</span>
                    <span className="text-gray-500 ml-auto">
                      +{country.dialCode}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
  
        <Input
          ref={inputRef}
          type="tel"
          placeholder="Enter phone number"
          value={inputValue}
          onChange={handlePhoneValueChange}
          className="flex-1"
          
        />
      </div>
    );
  };
  