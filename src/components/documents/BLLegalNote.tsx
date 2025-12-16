
export default function BLLegalNote() {
    return (
        <div className="bl-legal-wrapper border-t border-gray-300 mt-4 pt-2">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-4 mb-2">
                <img
                    src="/kohesar_logo.png"
                    alt="Kohesar Logistics (Private Limited)"
                    className="h-8 w-auto object-contain"
                />
                <div className="font-bold uppercase text-[10px] tracking-wide">
                    KOHESAR LOGISTICS (PRIVATE LIMITED)
                </div>
            </div>

            {/* Legal Note Text */}
            <div className="space-y-2 text-justify">
                <p>
                    Received by the Carrier from the Shipper in apparent good order and
                    condition unless otherwise indicated herein, the Goods, or the
                    Container(s), or package(s) said to contain the cargo herein mentioned,
                    to be carried subject to all the terms and conditions appearing on the
                    face and back of this Bill of Lading by the vessel named herein or any
                    substitute at the Carrier’s option and/or other vessel at the Carrier’s
                    option, from the Place of Receipt or Port of Loading shown herein to the
                    Port of Discharge or the Place of Delivery shown herein and there to be
                    delivered unto order or assigns.
                </p>

                <p>
                    This Bill of Lading duly endorsed must be surrendered in exchange for the
                    Goods or delivery order. In accepting this Bill of Lading, the Merchant
                    agrees to be bound by all the stipulations, exceptions, terms and
                    conditions on the face and back hereof and of the Carrier’s applicable
                    tariff, whether written, typed, stamped or printed, as fully as if
                    signed by the Merchant, any local custom or privilege to the contrary
                    notwithstanding, and agrees that all agreements or freight engagements
                    are replaced by this Bill of Lading.
                </p>
            </div>

            <style>{`
        .bl-legal-wrapper {
          font-family: "Times New Roman", Times, serif;
          font-size: 8px; /* Slightly adjusted for fitting */
          line-height: 1.2;
          color: #000;
        }
      `}</style>
        </div>
    );
}
