package <%= appPackage %>.presentation.view.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.app.Activity;

import <%= appPackage %>.presentation.R;

public class AboutActivity extends Activity {

    public static Intent getCallingIntent(Context ctx){
        return new Intent(ctx, AboutActivity.class);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);
    }

}
