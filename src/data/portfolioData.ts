import { profileData } from "./profile";
import { ProfileData } from "../types";
export { profileData, type ProfileData };

export const profile = profileData;
export const skills = profileData.skills;
export const projects = profileData.projects;
export const education = profileData.education;
export const certifications = profileData.certifications;

// Sample dirty data for the in-app interactive Data Cleaning Studio
export const sampleDirtyDatasets = {
  ecommerce: [
    { id: 101, customer_name: "Aarav Sharma", age: 28, email: "aarav.s@gmail.com", monthly_spend: 450, transactions: 12, churned: "No", join_date: "2023-01-15" },
    { id: 102, customer_name: "Priya Patel", age: null, email: "priya.p@outlook.com", monthly_spend: 1200, transactions: 24, churned: "No", join_date: "2022-11-04" },
    { id: 103, customer_name: "Rahul Verma", age: 34, email: "rahul.v@gmail.com", monthly_spend: 320, transactions: null, churned: "Yes", join_date: "2023-05-20" },
    { id: 104, customer_name: "Sneha Reddy", age: 29, email: "sneha_r@yahoo.com", monthly_spend: 54000, transactions: 8, churned: "No", join_date: "2023-03-11" }, // Outlier spend
    { id: 105, customer_name: "Aarav Sharma", age: 28, email: "aarav.s@gmail.com", monthly_spend: 450, transactions: 12, churned: "No", join_date: "2023-01-15" }, // Exact Duplicate
    { id: 106, customer_name: "Karthik Kumar", age: 42, email: null, monthly_spend: 850, transactions: 18, churned: "No", join_date: "2021-08-19" },
    { id: 107, customer_name: "Ananya Iyer", age: 25, email: "ananya.i@tech.in", monthly_spend: null, transactions: 6, churned: "Yes", join_date: "2023-09-01" },
    { id: 108, customer_name: "Vikram Malhotra", age: 145, email: "vikram.m@gmail.com", monthly_spend: 920, transactions: 15, churned: "No", join_date: "2022-04-12" }, // Outlier age
    { id: 109, customer_name: "Neha Gupta", age: 31, email: "neha.g@outlook.com", monthly_spend: 610, transactions: 11, churned: "No", join_date: "2023-02-28" },
    { id: 110, customer_name: "Priya Patel", age: null, email: "priya.p@outlook.com", monthly_spend: 1200, transactions: 24, churned: "No", join_date: "2022-11-04" }, // Duplicate
  ],
  telecom: [
    { customer_id: "TC-01", tenure_months: 12, contract_type: "Month-to-Month", monthly_bill: 75.5, tech_support: "No", total_charges: 906, churn: 1 },
    { customer_id: "TC-02", tenure_months: 48, contract_type: "Two-Year", monthly_bill: 105.0, tech_support: "Yes", total_charges: null, churn: 0 },
    { customer_id: "TC-03", tenure_months: 3, contract_type: "Month-to-Month", monthly_bill: 55.0, tech_support: "No", total_charges: 165, churn: 1 },
    { customer_id: "TC-04", tenure_months: 72, contract_type: "Two-Year", monthly_bill: 118.2, tech_support: "Yes", total_charges: 8510, churn: 0 },
    { customer_id: "TC-05", tenure_months: null, contract_type: "One-Year", monthly_bill: 89.0, tech_support: "No", total_charges: 1800, churn: 0 },
    { customer_id: "TC-01", tenure_months: 12, contract_type: "Month-to-Month", monthly_bill: 75.5, tech_support: "No", total_charges: 906, churn: 1 }, // Duplicate
  ]
};
