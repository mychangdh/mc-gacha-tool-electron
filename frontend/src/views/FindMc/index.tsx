import { Button, Modal } from 'antd';
import { useState } from 'react';
import './index.scss'
import { FileSearchOutlined } from '@ant-design/icons'
import { Input } from 'antd';
import { ipc } from '@/utils/ipcRender';



export default function ({ showMessage = true }) {
    const [showFindMc, setShowFindMc] = useState(true)
    const [fileName, setFileName] = useState("")
    function selectFile() {
        ipc.invoke('openFilesDialog').then(({ filePaths }: any) => {
            if (!filePaths[0]) return
            setFileName(filePaths[0] as string)
        })
    }
    return (
        <>
            <Modal
                open={showFindMc}
                title="请手动选择安装位置"
                onCancel={() => setShowFindMc(false)}
                footer={[]}
                width="60%"
                closable={false}
                maskClosable={false}
                className='no-select'
            >
                {showMessage ? <p>没有找到安装目录呢，请手动选择一下吧</p> : <></>}

                <div className="find-mk">
                    <Input addonBefore={<FileSearchOutlined />}
                        value={fileName} onClick={selectFile} placeholder="点击选择安装目录"></Input>
                    <Button className='btn' type="primary">确定</Button>
                </div>
            </Modal>

        </>
    )
}