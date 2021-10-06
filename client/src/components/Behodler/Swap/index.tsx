import * as React from 'react'
import { useContext } from 'react'
import TradingBox3 from './TradingBox3'
import { makeStyles, createStyles, Box } from '@material-ui/core'
import { UIContainerContextProps } from '@behodler/sdk/dist/types'
import { ContainerContext } from 'src/components/Contexts/UIContainerContextDev'
import { WalletContext, WalletContextProvider } from 'src/components/Contexts/WalletStatusContext'
import { StatelessBehodlerContextProvider } from './EVM_js/context/StatelessBehodlerContext'
import Unconnected from './TradingBox3/Unconnected'
import backImage from "../../../images/new/behodler-swap-bg.jpg";

export type permittedRoutes = 'swap' | 'liquidity' | 'sisyphus' | 'faucet' | 'behodler/admin' | 'governance' | 'swap2' | 'pyro'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        SwapRoot: {
            flexGrow: 1,
            margin: 0,
            paddingTop: 50,
        },
        SwapRootNotConnected: {
            flexGrow: 1,
            margin: 0,
        },
        noWalletContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '64px 16px 32px 16px',
        },
        behodlerHeading: {
            color: 'white',
            fontWeight: 'bold',
        },
        behodlerSubheading: {
            color: 'midnightblue',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontStyle: 'italic',
        },
        alphadrop: {
            color: 'white',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h6.fontSize || '1.25rem',
            fontWeight: 'bold',
        },
        link: {
            fontStyle: 'italic',
        },
        connectButton: {
            margin: '20px 0 0 0',
        },
        warningText: {
            color: 'black',
            fontStyle: 'italic',
            maxWidth: 500,
            textAlign: 'center',
        },
        behodlerLogo: {
            width: '30%',
        },
        logoContainer: {
            textAlign: 'center',
            display: 'block',
        },
        headerText: {
            textAlign: 'center',
        },
        eyeLogo: {
            width: 400,
            margin: '0 -20px -60px 0'
        },
        errorMessage: {
            color: theme.palette.secondary.main,
            textAlign: 'center',
        },
        layoutFrameroot: {
            backdropFilter: "blur(4px)",
            height: "100%",
            width: "100%",
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)),url(${backImage})`,

            background: '#C4C4C4',
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% 100%",
            overflowY: "scroll",
        }, content: {
            width: "100%",
            margin: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
        },
        mainContent: {
            width: "100%",
        },
    })
)

/*
<Box className={notConnected ? classes.layoutFramerRotNotConnected : classes.layoutFrameroot}>
                <Box className={classes.content}>
                    <Box className={classes.mainContent} flexGrow={1}>
                          <WalletContextProvider containerProps={uiContainerContextProps} chainId={chainId} accountId={account}>
                <ConnectedDapp />
            </WalletContextProvider>
                    </Box>
                </Box>
            </Box>
*/

export default function Swap(props: {}) {

    const uiContainerContextProps = useContext<UIContainerContextProps>(ContainerContext)
    const chainId = uiContainerContextProps.walletContext.chainId || 0;
    const account = uiContainerContextProps.walletContext.account || '0x0'
    const classes = useStyles();
    var x = <div></div>
    try {
        x = (
            <Box className={classes.layoutFrameroot}>
                <Box className={classes.content}>
                    <Box className={classes.mainContent} flexGrow={1}>
                        <WalletContextProvider containerProps={uiContainerContextProps} chainId={chainId} accountId={account}>
                            <ConnectedDapp />
                        </WalletContextProvider>
                    </Box>
                </Box>
            </Box>
        )
    } catch (e) {
        x = <div>uncaught {e}</div>
    }
    return x
}

function ConnectedDapp() {
    const walletContextProps = useContext(WalletContext);
    const classes = useStyles()
    return <div className={classes.root}>
        {walletContextProps.initialized ?
            <StatelessBehodlerContextProvider>
                <TradingBox3 />
            </StatelessBehodlerContextProvider>
            : <Unconnected />}
    </div>
}