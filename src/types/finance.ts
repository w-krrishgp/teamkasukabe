export type SchemeStatus = 'eligible' | 'applied' | 'approved' | 'action_needed';

export interface AgriScheme {
  id: string;
  name: string;
  category: 'subsidy' | 'insurance' | 'credit' | 'direct_benefit';
  benefitAmount: string;
  deadline?: string;
  status: SchemeStatus;
  description: string;
  eligibilityNotes: string;
  applicationUrl?: string;
}

export interface LoanOrCreditSummary {
  kisanCreditLimit: number;
  utilizedAmount: number;
  interestSubsidyEligible: boolean;
  nextRepaymentDate: string;
}
