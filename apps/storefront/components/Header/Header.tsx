import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/legacy/image";
import NavIconButton from "../Navbar/NavIconButton";
import UserMenu from "../Navbar/UserMenu";
import usePaths from "@/lib/paths";
import { CheckoutLineDetailsFragment } from "@/saleor/api";
import { useRouter } from "next/router";
import { useUser } from "@/lib/useUser";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "@/components/RegionsProvider";
import { invariant } from "@apollo/client/utilities/globals";
import { BurgerMenu } from "../BurgerMenu";
import { PhoneIcon } from "@heroicons/react/outline";
import Navbar from "../Navbar";
import { getSubdomain } from "@/lib/subdomain";

export function Header() {
  return null;
}
export default Header;
