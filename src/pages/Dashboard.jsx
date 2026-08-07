import Header from "../components/Header/Header";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

import CurtisPanel from "../components/CurtisPanel/CurtisPanel";

import BMSPanel from "../components/BMS/BMSPanel";

export default function Dashboard(){

    return(

        <>

            <Header/>

            <DashboardLayout

                left={<CurtisPanel/>}

                right={<BMSPanel/>}

            />

        </>

    )

}