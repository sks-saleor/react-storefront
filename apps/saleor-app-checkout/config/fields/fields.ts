import { useIntl } from "react-intl";
import { Customization, CustomizationSettings, SettingID, CustomizationID } from "types/common";
import {
  PaymentMethod,
  PaymentProvider,
  PaymentProviderSettings,
  PaymentProviderID,
} from "checkout-common";
import {
  brandingCustomizationMessages,
  customizationMessages,
  sectionsCustomizationMessages,
} from "./messages/customization";
import { paymentMethodsMessages } from "./messages/paymentMethods";
import {
  molliePaymentProviderMessages,
  paymentProvidersMessages,
} from "./messages/paymentProviders";
import { withLabels, withNames } from "./utils";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import AppleIcon from "@material-ui/icons/Apple";
import PayPalIcon from "./icons/PayPal";
import MollieIcon from "./icons/Mollie";
import DummyIcon from "./icons/Dummy";

const paymentMethods: Omit<PaymentMethod, "name">[] = [
  {
    id: "creditCard",
    logo: CreditCardIcon,
  },
  {
    id: "applePay",
    logo: AppleIcon,
  },
  {
    id: "paypal",
    logo: PayPalIcon,
  },
  {
    id: "dummy",
    logo: DummyIcon,
  },
];

const molliePaymentProvider: Omit<PaymentProviderSettings<"mollie">, "label">[] = [
  {
    id: "profileId",
    type: "string",
    encrypt: false,
  },
  {
    id: "apiKey",
    type: "string",
    encrypt: true,
  },
];

const brandingCustomization: Omit<CustomizationSettings<"branding">, "label">[] = [
  {
    id: "buttonBgColorPrimary",
    type: "color",
  },
  {
    id: "buttonBgColorHover",
    type: "color",
  },
  {
    id: "borderColorPrimary",
    type: "color",
  },
  {
    id: "errorColor",
    type: "color",
  },
  {
    id: "successColor",
    type: "color",
  },
  {
    id: "buttonTextColor",
    type: "color",
  },
  {
    id: "textColor",
    type: "color",
  },
  {
    id: "logoUrl",
    type: "image",
  },
];

const sectionsCustomization: Omit<CustomizationSettings<"productSettings">, "label">[] = [
  {
    id: "lowStockThreshold",
    type: "string",
  },
];

const channelActivePaymentProvidersFields: Record<"anyChannel", any> = {
  anyChannel: paymentMethods,
};
const customizationsFields: Record<CustomizationID, any> = {
  branding: brandingCustomization,
  productSettings: sectionsCustomization,
};
const paymentProviderFields: Record<PaymentProviderID, any> = {
  mollie: molliePaymentProvider,
  dummy: {},
};

export type CommonField = { id: string } & Record<string, any>;
export const fields: Record<SettingID[number], Record<string, CommonField[]>> = {
  channelActivePaymentProviders: channelActivePaymentProvidersFields,
  customizations: customizationsFields,
  paymentProviders: paymentProviderFields,
};

export const usePaymentMethods = (): PaymentMethod[] => {
  const intl = useIntl();

  return withNames(intl, paymentMethodsMessages, paymentMethods);
};

export const useMolliePaymentProvider = (): PaymentProvider<"mollie"> => {
  const intl = useIntl();

  return {
    id: "mollie",
    label: intl.formatMessage(paymentProvidersMessages.mollie),
    logo: MollieIcon,
    settings: withLabels(intl, molliePaymentProviderMessages, molliePaymentProvider),
  };
};

export const useDummyPaymentProvider = (): PaymentProvider<"dummy"> => {
  const intl = useIntl();

  return {
    id: "dummy",
    label: intl.formatMessage(paymentProvidersMessages.dummy),
    settings: [],
  };
};

export const usePaymentProviders = (): PaymentProvider<PaymentProviderID>[] => [
  useMolliePaymentProvider(),
];

export const useBrandingCustomization = (): Customization<"branding"> => {
  const intl = useIntl();

  return {
    id: "branding",
    label: intl.formatMessage(customizationMessages.branding),
    settings: withLabels(intl, brandingCustomizationMessages, brandingCustomization),
  };
};

export const useSectionsCustomization = (): Customization<"productSettings"> => {
  const intl = useIntl();

  return {
    id: "productSettings",
    label: intl.formatMessage(customizationMessages.productSettings),
    settings: withLabels(intl, sectionsCustomizationMessages, sectionsCustomization),
  };
};

export const useCustomizations = () => [useBrandingCustomization(), useSectionsCustomization()];
